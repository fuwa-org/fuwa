import { AsyncQueue } from '@sapphire/async-queue';
import {
  APIGuildMember,
  APIMessage,
  GatewayCloseCodes,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
  GatewayGuildCreateDispatchData,
  GatewayGuildDeleteDispatchData,
  GatewayGuildMemberAddDispatchData,
  GatewayGuildMemberRemoveDispatchData,
  GatewayGuildMembersChunkDispatchData,
  GatewayGuildMemberUpdateDispatchData,
  GatewayGuildUpdateDispatchData,
  GatewayIdentify,
  GatewayMessageCreateDispatchData,
  GatewayMessageDeleteBulkDispatchData,
  GatewayMessageDeleteDispatchData,
  GatewayMessageUpdateDispatchData,
  GatewayOpcodes,
  GatewayReadyDispatchData,
  GatewayReceivePayload,
  GatewayResume,
  GatewaySendPayload,
} from '@splatterxl/discord-api-types';
import WebSocket from 'ws';
import { Client } from '../client/Client';
import { Snowflake } from '../client/ClientOptions';
import { Guild } from '../structures/Guild';
import { ExtendedUser } from '../structures/ExtendedUser';
import { Intents } from '../util/bitfields/Intents';
import { GuildMember } from '../structures/GuildMember';
import { Message } from '../structures/Message';
import { TextChannel } from '../structures/templates/BaseTextChannel';

/**
 * Typeguard for Erlpack interfaces
 */
export interface Erlpack {
  pack(data: any): Buffer;
  unpack<T>(data: Buffer): T;
}

let erlpack: Erlpack;
try {
  erlpack = require('erlpack');
} catch {
  // it's not installed
}

/** A shard connection the Discord gateway. */
export class GatewayShard {
  private _socket?: WebSocket;
  #messageQueue = new AsyncQueue();
  private messageQueueCount = 0;
  #token: string;
  public compress: boolean;
  public erlpack: boolean;
  public id: number;
  private heartbeat_interval = -1;
  private heartbeat_at = -1;
  private heartbeat_acked = true;
  private url = 'wss://gateway.discord.gg/?v=9&encoding=json';

  /** The latency between us and Discord, in milliseconds. */
  public ping = -1;

  private s = -1;
  public session?: string;

  private _awaitedGuilds: Snowflake[] = [];

  #timers: NodeJS.Timer[] = [];
  #timeouts: NodeJS.Timeout[] = [];

  constructor(
    public client: Client,
    public readonly shard: [number, number],
    token: string
  ) {
    this.id = shard[0]!;
    this.compress = client.options.compress;

    if (typeof this.client.options.etf === 'boolean') {
      this.erlpack = this.client.options.etf;
    } else {
      this.erlpack = true;
      erlpack = this.client.options.etf;
    }

    this.#token = token;
  }

  private authenticate() {
    if (this.session) {
      this.send(<GatewayResume>{
        op: GatewayOpcodes.Resume,
        d: {
          token: this.#token,
          session_id: this.session,
          seq: this.s,
        },
      });
    } else {
      this.send(<GatewayIdentify>{
        op: GatewayOpcodes.Identify,
        d: {
          token: this.#token,
          properties: {
            $browser: this.client.options.wsBrowser,
            $device: this.client.options.wsDevice,
            $os: this.client.options.wsOS,
          },
          compress: this.compress,
          shard: this.shard,
          intents: (this.client.options.intents as Intents).bits,
        },
      });
    }
  }

  /** Opens a connection to Discord. */
  public async connect(url = this.url) {
    this.url = url;

    this._socket = new WebSocket(url);

    this._socket.on('open', () => {
      this.authenticate();
    });
    this._socket.on('message', this.onMessage.bind(this));
    this._socket.on('close', (code, reason) => {
      this.debug(
        `Gateway closed with code`,
        code,
        `reason`,
        reason?.toString() ?? GatewayCloseCodes[code]
      );
      switch (code) {
        case GatewayCloseCodes.InvalidIntents:
          throw new Error(
            `Gateway intents ${this.client.options.intents} are invalid.`
          );
        case GatewayCloseCodes.InvalidShard:
          throw new Error('Invalid shard passed to GatewayShard');
        case GatewayCloseCodes.DisallowedIntents:
          throw new Error(
            `Gateway intents ${this.client.options.intents} are disallowed for the client.`
          );
        case GatewayCloseCodes.AuthenticationFailed:
          throw new Error('Client token is invalid');
        case 1000:
        case GatewayCloseCodes.InvalidSeq:
        case GatewayCloseCodes.SessionTimedOut:
          this.reset();
        // eslint-disable-next-line no-fallthrough
        default:
          this.debug('Socket closed, reconnecting...');
          this.connect(url);
          break;
      }
    });
  }

  private reset(full = false) {
    if (full) {
      this.debug('Shard undergoing reset, closing socket');
      this._terminate();
      this._socket = undefined;
    }

    this.#messageQueue = new AsyncQueue();
    this.messageQueueCount = 0;
    this.#timers.forEach((t) => clearInterval(t));
    this.#timeouts.forEach((t) => clearTimeout(t));
    this.heartbeat_interval = -1;
    // to prevent the heartbeater to immediately panic and reconnect, creating an infinite loop
    this.heartbeat_acked = true;
    this._awaitedGuilds = [];
    this.debug('Reset shard');
  }

  public debug(...data: any[]) {
    this.client.debug(
      `[${this.client.logger.kleur().blue('WS')} => ${this.client.logger
        .kleur()
        .yellow(this.id.toString())}]`,
      ...data
    );
  }

  private debugPretty(message: string, data: Record<string, any>) {
    this.debug(
      message,
      '\n',
      Object.entries(data)
        .map(([K, V]) => `\t${K}\t\t:\t${V}`)
        .join('\n')
    );
  }

  private async onMessage(message: Buffer) {
    let buffer = message;

    if (this.erlpack) {
      buffer = erlpack.unpack(buffer);
    }

    const data: GatewayReceivePayload = this.erlpack
      ? (buffer as unknown as any)
      : JSON.parse(buffer.toString());

    const payload: any = data.d;

    if (data.s) {
      this.s = data.s;
    }

    switch (data.op) {
      case GatewayOpcodes.Hello: {
        this.heartbeat_interval = payload.heartbeat_interval;
        this.debug(
          'commencing heartbeating with interval of',
          this.heartbeat_interval
        );
        this.startHeartbeat();

        break;
      }
      case GatewayOpcodes.Heartbeat: {
        this.heartbeat();

        break;
      }
      case GatewayOpcodes.HeartbeatAck: {
        this.heartbeat_acked = true;
        this.ping = Date.now() - this.heartbeat_at;

        this.debug('heartbeat acked with ping of ' + this.ping + 'ms');

        break;
      }
      case GatewayOpcodes.Reconnect: {
        this.reconnect();

        break;
      }
      case GatewayOpcodes.InvalidSession: {
        this.debug('invalid session passed');
        this.close(false);
        this.reset();
        this.connect();

        break;
      }
      case GatewayOpcodes.Dispatch: {
        let event = payload as GatewayDispatchPayload['d'];

        this.debug("received dispatch", data.t);

        switch (data.t) {
          case GatewayDispatchEvents.Ready: {
            event = event as GatewayReadyDispatchData;

            this.session = event.session_id;
            this._awaitedGuilds = event.guilds.map((v) => v.id as Snowflake);

            this.debugPretty('ready for user ' + event.user.id, {
              session: this.session,
              shard: '[' + event.shard?.join(', ') + ']',
              guilds: event.guilds?.length,
            });

            this.client.users.add(
              new ExtendedUser(this.client)._deserialise(event.user)
            );

            this.client.user = this.client.users.get(
              event.user.id as Snowflake
            ) as ExtendedUser;

            if (
              !(<Intents>this.client.options.intents).has(Intents.Bits.Guilds)
            ) {
              this.client.logger.warn(
                "Client intents don't include guilds, this may cause issues."
              );
              this.client.delegate('meta.ready');
            }

            break;
          }
          case GatewayDispatchEvents.Resumed: {
            this.debug('resumed session', this.session);
            break;
          }
          case GatewayDispatchEvents.GuildCreate: {
            const data = event as GatewayGuildCreateDispatchData;
            this.client.guilds.add(new Guild(this.client)._deserialise(data));

            if (this._awaitedGuilds.includes(data.id as Snowflake)) {
              this._awaitedGuilds = this._awaitedGuilds.filter(
                (v) => v !== data.id
              );

              if (this._awaitedGuilds.length === 0) {
                this.client.delegate('meta.ready');
              }
            } else {
              this.client.delegate(
                'guilds.create',
                this.client.guilds.cache.get(data.id as Snowflake)
              );
            }
            break;
          }
          case GatewayDispatchEvents.GuildUpdate: {
            const data = event as GatewayGuildUpdateDispatchData;
            const guild = this.client.guilds.cache.get(data.id as Snowflake);
            const newGuild =
              guild?._deserialise(data) ??
              new Guild(this.client)._deserialise(data);

            this.client.guilds.update(newGuild);

            this.client.delegate('guilds.update', guild, newGuild);
            break;
          }
          case GatewayDispatchEvents.GuildDelete: {
            const data = event as GatewayGuildDeleteDispatchData;
            this.client.guilds.remove(data.id as Snowflake);

            this.client.delegate('guilds.delete', data.id);
            break;
          }
          case GatewayDispatchEvents.GuildMemberAdd: {
            const data = event as GatewayGuildMemberAddDispatchData;
            const guild = this.client.guilds.cache.get(
              data.guild_id as Snowflake
            );

            if (guild) {
              const member = new GuildMember(this.client, guild.id)._deserialise(data);
              guild.members.add(member);

              this.client.delegate('guilds.members.add', member);
            }
            break;
          }
          case GatewayDispatchEvents.GuildMemberRemove: {
            const data = event as GatewayGuildMemberRemoveDispatchData;
            const guild = this.client.guilds.cache.get(
              data.guild_id as Snowflake
            );

            if (guild) {
              const member = guild.members.get(
                data.user.id as Snowflake
              ) as GuildMember;

              guild.members.remove(member.id);

              this.client.delegate('guilds.members.remove', member.user!, guild);
              this.client.guilds.update(guild!);
            }

            break;
          }
          case GatewayDispatchEvents.GuildMemberUpdate: {
            const data = event as GatewayGuildMemberUpdateDispatchData;
            const guild = this.client.guilds.cache.get(
              data.guild_id as Snowflake
            );

            if (guild) {
              const member = guild.members.get(
                data.user.id as Snowflake
              ) as GuildMember;

              const newMember = member._deserialise(data as APIGuildMember);

              guild.members.update(newMember);

              this.client.delegate('guilds.members.update', member, newMember);
              this.client.guilds.update(guild!);
            }
            break;
          }
          case GatewayDispatchEvents.GuildMembersChunk: {
            const data = event as GatewayGuildMembersChunkDispatchData;
            const guild = this.client.guilds.cache.get(
              data.guild_id as Snowflake
            );

            if (guild) {
              const members = data.members.map((v) =>
                new GuildMember(this.client, guild.id)._deserialise(v)
              );

              guild.members.addMany(members);

              this.client.delegate('guilds.members.chunk', members);
              this.client.guilds.update(guild!);
            }
            break;
          }
          case GatewayDispatchEvents.MessageCreate: {
            const data = event as GatewayMessageCreateDispatchData;
            const channel = this.client.channels.cache.get(
              data.channel_id as Snowflake
            ) as TextChannel;

            if (channel) {
              const message = new Message<typeof channel>(this.client)._deserialise(
                data
              );

              channel.messages.add(message);

              this.client.delegate('meta.messages.create', message);
            }
            break;
          }
          case GatewayDispatchEvents.MessageUpdate: {
            const data = event as GatewayMessageUpdateDispatchData;
            const channel = this.client.channels.cache.get(
              data.channel_id as Snowflake
            ) as TextChannel;

            if (channel) {
              const message = channel.messages.cache.get(
                data.id as Snowflake
              ) as Message<typeof channel>;

              if (message) {
                const newMessage = message._deserialise(data as APIMessage);
                channel.messages.update(newMessage);

                this.client.delegate('meta.messages.update', message, newMessage);
              }
            }
            break;
          }
          case GatewayDispatchEvents.MessageDelete: {
            const data = event as GatewayMessageDeleteDispatchData;
            const channel = this.client.channels.cache.get(
              data.channel_id as Snowflake
            ) as TextChannel;

            if (channel) {
              channel.messages.cache.delete(
                data.id as Snowflake
              );

              this.client.delegate('meta.messages.delete', { 
                channel,
                guild: channel.guild,
                id: data.id,
              });
            }
            break;
          }
          case GatewayDispatchEvents.MessageDeleteBulk: {
            const data = event as GatewayMessageDeleteBulkDispatchData;
            const channel = this.client.channels.cache.get(
              data.channel_id as Snowflake
            ) as TextChannel;

            if (channel) {
              channel.messages.removeMany(data.ids as Snowflake[]);

              this.client.delegate('meta.messages.delete', { 
                channel,
                guild: channel.guild,
                ids: data.ids,
              });
            }
            break;
          }
          default: {
            this.client.logger.warn(
              'Unhandled dispatch event',
              data.t,
            );
            this.debug("Event:", data.d);
          }
        }

        break;
      }
    }
  }

  /**
   * Send a packet to the {@link GatewayShard._socket|socket}. Use at your own risk.
   */
  public async send(packet: GatewaySendPayload) {
    if (!this._socket)
      throw new Error("GatewayShard#send called when shard wasn't connected");

    this.messageQueueCount++;
    // aaaaaaa
    await this.#messageQueue.wait();

    if (this.messageQueueCount === 0) {
      // we can't send this message
      return;
    }

    let data: Buffer;

    if (this.erlpack) {
      data = erlpack.pack(packet);
    } else {
      data = Buffer.from(JSON.stringify(packet));
    }

    this._socket!.send(data);

    this.#messageQueue.shift();
    this.messageQueueCount--;
  }

  /**
   * Send a heartbeat through the {@link GatewayShard._socket|socket}. Use at your own risk.
   *
   * **Warning**: if you use this too soon after previously heartbeating, the internal property {@link GatewayShard.heartbeat_acked} may not be set correctly, causing the shard to assume a dead connection and close the socket.
   */
  public heartbeat() {
    if (!this.heartbeat_acked) {
      this.reconnect();
    }

    this.heartbeat_at = Date.now();

    this.send({
      op: GatewayOpcodes.Heartbeat,
      d: this.s,
    });

    this.heartbeat_acked = false;

    this.debug('sent heartbeat, seq ' + this.s);

    this.#timeouts.push(
      setTimeout(() => {
        if (!this.heartbeat_acked) {
          this.debug('closing due to heartbeat timeout');
          this.reconnect();
        }
      }, 10e3)
    );
  }

  /**
   * Close the connection to Discord.
   * @param resume Whether to keep the session ID and sequence intact.
   */
  public close(resume = true) {
    this._socket?.close(resume ? 4000 : 1000);

    if (!resume) {
      this.session = undefined;
      this.s = -1;
    }

    this.#timers.forEach((t) => clearInterval(t));
    this.#timeouts.forEach((t) => clearInterval(t));
  }

  private _terminate() {
    this._socket?.terminate();

    this.#timers.forEach((t) => clearInterval(t));
    this.#timeouts.forEach((t) => clearInterval(t));
  }

  public reconnect() {
    this.close(true);
  }

  private startHeartbeat() {
    this.#timers.push(
      setInterval(this.heartbeat.bind(this), this.heartbeat_interval)
    );
    this.#timeouts.push(
      setTimeout(
        this.heartbeat.bind(this),
        this.heartbeat_interval * Math.random()
      )
    );
  }
}
