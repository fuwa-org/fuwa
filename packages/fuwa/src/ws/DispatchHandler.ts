import { GatewayManager, GatewayShard } from '@fuwa/ws';
import {
  APIGuildMember,
  APIMessage,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
} from 'discord-api-types/v10';
import { Client } from '../client/Client.js';
import { Channel } from '../structures/Channel.js';
import { ExtendedUser } from '../structures/ExtendedUser';
import { Guild } from '../structures/Guild';
import { GuildChannels } from '../structures/GuildChannel.js';
import { GuildMember } from '../structures/GuildMember.js';
import { Message } from '../structures/Message.js';
import { Intents } from '../util/bitfields/Intents';

export async function handleDispatch(
  client: Client,
  manager: GatewayManager,
  data: GatewayDispatchPayload,
  shard: GatewayShard,
) {
  switch (data.t) {
    //#region Shards
    case GatewayDispatchEvents.Ready: {
      shard.session = data.d.session_id;
      shard._awaitedGuilds = data.d.guilds.map(g => g.id);

      const user = new ExtendedUser(client)._deserialise(data.d.user);

      client.user = user;
      client.users.add(user);

      // data.d.application

      client.debug(`ready with ${data.d.guilds.length} guilds to sync`);

      if (
        (client.options.intents as Intents).has(Intents.Bits.Guilds) &&
        data.d.guilds.length > 0
      ) {
        shard.setTimeout(() => {
          if (shard._awaitedGuilds.length) {
            client.debug(
              `shard ${shard.id} has ${shard._awaitedGuilds.length} guilds left to sync after 20s`,
            );
            shard.ready();
          }
        }, 20e3);
      } else {
        client.debug(
          `shard ${shard.id} has no guilds to receive, marking as available`,
        );
        shard.ready();
      }

      shard.emit('preReady');

      break;
    }
    //#endregion

    //#region Guilds
    case GatewayDispatchEvents.GuildCreate: {
      if (shard._awaitedGuilds === null) {
        await shard.awaitPacket(d => d.t === 'READY');
      }

      const guild = new Guild(client)._deserialise(data.d);
      client.guilds.add(guild);

      if (shard._awaitedGuilds.includes(guild.id)) {
        shard._awaitedGuilds.splice(shard._awaitedGuilds.indexOf(guild.id), 1);
        if (shard._awaitedGuilds.length === 0) {
          client.debug(`shard ${shard.id} has no guilds left to sync`);
          shard.ready();
        }
      } else {
        manager.event('guildCreate', guild);
      }

      break;
    }
    case GatewayDispatchEvents.GuildUpdate: {
      const guild = client.guilds.get(data.d.id);
      const oldGuild = client.guilds.get(data.d.id);

      if (!guild) {
        client.logger.warn(
          `received guild update for ${data.d.id} but it doesn't exist in cache; ignoring`,
        );
        break;
      }

      guild._deserialise(data.d);

      client.guilds.update(guild);

      manager.event('guildUpdate', oldGuild, guild);
      break;
    }
    case GatewayDispatchEvents.GuildDelete: {
      client.guilds.remove(data.d.id);

      manager.event('guildDelete', data.d.id);
      break;
    }
    //#endregion

    //#region Channels
    case GatewayDispatchEvents.ChannelCreate: {
      const channel = Channel.create(client, data.d as unknown as any);

      if ((<any>data.d).guild_id) {
        const guild = client.guilds.get((<any>data.d).guild_id);

        if (!guild) {
          client.logger.warn(
            `received channel create for ${data.d.id} but it doesn't exist in cache; ignoring`,
          );
          break;
        }

        guild.channels.add(channel as GuildChannels);
      } else {
        client.channels.add(channel);
      }

      manager.event('channelCreate', channel);

      break;
    }
    case GatewayDispatchEvents.ChannelUpdate: {
      let channel = client.channels.get(data.d.id);
      const oldChannel = client.channels.get(data.d.id);

      if (!channel) {
        client.logger.warn(
          `received channel update for ${data.d.id} but it doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (data.d.type && channel.type !== data.d.type) {
        // @ts-ignore
        channel = Channel.create(client, {
          ...channel.toJSON(),
          ...data.d,
        });
      } else {
        channel._deserialise(data.d);
      }

      if (channel.guildId) {
        const guild = client.guilds.get(channel.guildId);

        if (!guild) {
          client.logger.warn(
            `received channel update for ${data.d.id} but guild doesn't exist in cache; not setting in guild`,
          );
        } else {
          guild.channels.update(channel as GuildChannels);
        }
      }

      client.channels.update(channel);

      manager.event('channelUpdate', channel, oldChannel);
      break;
    }
    case GatewayDispatchEvents.ChannelDelete: {
      const channel = client.channels.get(data.d.id);

      if (!channel) break;

      if (channel.guildId) {
        const guild = client.guilds.get(channel.guildId);

        if (!guild) {
          client.logger.warn(
            `received channel delete for ${data.d.id} but guild doesn't exist in cache; not removing from guild`,
          );
        } else {
          guild.channels.remove(channel.id);
        }
      }

      client.channels.remove(channel.id);

      manager.event('channelDelete', {
        guild: channel.guildId ?? null,
        id: channel.id,
      });
      break;
    }
    //#endregion

    //#region Members
    case GatewayDispatchEvents.GuildMemberAdd: {
      const guild = client.guilds.get(data.d.guild_id);

      if (!guild) {
        client.logger.warn(
          `received member add for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      const member = new GuildMember(client, guild.id)._deserialise(data.d);

      guild.members.add(member);

      manager.event('guildMemberAdd', member);
      break;
    }
    case GatewayDispatchEvents.GuildMemberUpdate: {
      const guild = client.guilds.get(data.d.guild_id);

      if (!guild) {
        client.logger.warn(
          `received member update for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      const member = guild.members.get(data.d.user.id);
      const oldMember = guild.members.get(data.d.user.id);

      if (!member) {
        client.logger.warn(
          `received member update for ${data.d.user.id} but member doesn't exist in cache; ignoring`,
        );
        break;
      }

      member._deserialise(data.d as APIGuildMember);

      guild.members.update(member);

      manager.event('guildMemberUpdate', oldMember, member);
      break;
    }
    case GatewayDispatchEvents.GuildMemberRemove: {
      const guild = client.guilds.get(data.d.guild_id);

      if (!guild) {
        client.logger.warn(
          `received member remove for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      guild.members.remove(data.d.user.id);

      manager.event('guildMemberRemove', {
        id: data.d.user.id,
        guild: guild.id,
      });
      break;
    }

    case GatewayDispatchEvents.GuildMembersChunk: {
      const guild = client.guilds.get(data.d.guild_id);

      if (!guild) {
        client.logger.warn(
          `received member chunk for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      for (const member of data.d.members) {
        const memberInstance = new GuildMember(client, guild.id)._deserialise(
          member,
        );

        guild.members.add(memberInstance);
      }

      manager.event(
        'guildMembersChunk',
        guild,
        data.d.members.map(v => v.user!.id),
      );
      break;
    }
    //#endregion

    //#region Messages
    case GatewayDispatchEvents.MessageCreate: {
      const channel = client.channels.get(data.d.channel_id);

      if (!channel) {
        client.logger.warn(
          `received message create for ${data.d.channel_id} but channel doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (!channel.isTextBased()) {
        client.logger.warn(
          `received message create for ${data.d.channel_id} but channel is not a text channel; ignoring`,
        );
        break;
      }

      const message = new Message(client)._deserialise(data.d);

      channel.messages.add(message);

      manager.event('messageCreate', message);
      break;
    }
    case GatewayDispatchEvents.MessageUpdate: {
      const channel = client.channels.get(data.d.channel_id);

      if (!channel) {
        client.logger.warn(
          `received message update for ${data.d.channel_id} but channel doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (!channel.isTextBased()) {
        client.logger.warn(
          `received message update for ${data.d.channel_id} but channel is not a text channel; ignoring`,
        );
        break;
      }

      const message = channel.messages.get(data.d.id);
      const oldMessage = channel.messages.get(data.d.id);

      if (!message) {
        client.logger.warn(
          `received message update for ${data.d.id} but message doesn't exist in cache; ignoring`,
        );
        break;
      }

      message._deserialise(data.d as APIMessage);

      channel.messages.update(message);

      manager.event('messageUpdate', oldMessage, message);
      break;
    }
    case GatewayDispatchEvents.MessageDelete: {
      const channel = client.channels.get(data.d.channel_id);

      if (!channel) {
        client.logger.warn(
          `received message delete for ${data.d.channel_id} but channel doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (!channel.isTextBased()) {
        client.logger.warn(
          `received message delete for ${data.d.channel_id} but channel is not a text channel; ignoring`,
        );
        break;
      }

      const message = channel.messages.get(data.d.id);

      if (!message) {
        client.logger.warn(
          `received message delete for ${data.d.id} but message doesn't exist in cache; ignoring`,
        );
        break;
      }

      channel.messages.remove(message.id);

      manager.event('messageDelete', {
        guild: channel.guildId ?? null,
        channel: channel.id,
        id: message.id,
      });
      break;
    }

    default: {
      client.logger.warn(`unhandled dispatch event ${data.t}`);
      client.logger.trace(data.t, data.d);
    }
  }
}
