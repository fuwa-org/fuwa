import {
  APIGuildMember,
  APIMessage,
  GatewayDispatchEvents,
  GatewayDispatchPayload,
} from 'discord-api-types/v10';
import { Channel } from '../structures/Channel.js';
import { ExtendedUser } from '../structures/ExtendedUser';
import { Guild } from '../structures/Guild';
import { GuildChannels } from '../structures/GuildChannel.js';
import { GuildMember } from '../structures/GuildMember.js';
import { Message } from '../structures/Message.js';
import { Intents } from '../util/bitfields/Intents';
import { GatewayManager } from './GatewayManager';
import { GatewayShard } from './GatewayShard';

export async function handleDispatch(
  manager: GatewayManager,
  data: GatewayDispatchPayload,
  shard: GatewayShard,
) {
  switch (data.t) {
    //#region Shards
    case GatewayDispatchEvents.Ready: {
      shard.session = data.d.session_id;
      shard._awaitedGuilds = data.d.guilds.map(g => g.id);

      const user = new ExtendedUser(shard.client)._deserialise(data.d.user);

      shard.client.user = user;
      shard.client.users.add(user);

      // data.d.application

      shard.debug(`ready with ${data.d.guilds.length} guilds to sync`);

      if ((shard.client.options.intents as Intents).has(Intents.Bits.Guilds)) {
        shard.setTimeout(() => {
          if (shard._awaitedGuilds.length) {
            shard.debug(
              `shard ${shard.id} has ${shard._awaitedGuilds.length} guilds left to sync after 20s`,
            );
            shard.ready();
          }
        }, 20e3);
      } else {
        shard.debug(
          `shard ${shard.id} has no guilds to receive, marking as available`,
        );
        shard.ready();
      }

      break;
    }
    case GatewayDispatchEvents.Resumed: {
      shard.ready();
      break;
    }
    //#endregion

    //#region Guilds
    case GatewayDispatchEvents.GuildCreate: {
      if (shard._awaitedGuilds === null) {
        await shard.awaitPacket(d => d.t === 'READY');
      }

      const guild = new Guild(shard.client)._deserialise(data.d);
      shard.client.guilds.add(guild);

      if (shard._awaitedGuilds.includes(guild.id)) {
        shard._awaitedGuilds.splice(shard._awaitedGuilds.indexOf(guild.id), 1);
        if (shard._awaitedGuilds.length === 0) {
          shard.debug(`shard ${shard.id} has no guilds left to sync`);
          shard.ready();
        }
      } else {
        manager.event('guildCreate', guild);
      }

      break;
    }
    case GatewayDispatchEvents.GuildUpdate: {
      const guild = shard.client.guilds.get(data.d.id);

      if (!guild) {
        shard.warn(
          `received guild update for ${data.d.id} but it doesn't exist in cache; ignoring`,
        );
        break;
      }

      guild._deserialise(data.d);

      shard.client.guilds.update(guild);
      break;
    }
    case GatewayDispatchEvents.GuildDelete: {
      shard.client.guilds.remove(data.d.id);
      break;
    }
    //#endregion

    //#region Channels
    case GatewayDispatchEvents.ChannelCreate: {
      const channel = Channel.create(shard.client, data.d as unknown as any);

      if ((<any>data.d).guild_id) {
        const guild = shard.client.guilds.get((<any>data.d).guild_id);

        if (!guild) {
          shard.warn(
            `received channel create for ${data.d.id} but it doesn't exist in cache; ignoring`,
          );
          break;
        }

        guild.channels.add(channel as GuildChannels);
      } else {
        shard.client.channels.add(channel);
      }

      manager.event('channelCreate', channel);

      break;
    }
    case GatewayDispatchEvents.ChannelUpdate: {
      let channel = shard.client.channels.get(data.d.id);
      const oldChannel = shard.client.channels.get(data.d.id);

      if (!channel) {
        shard.warn(
          `received channel update for ${data.d.id} but it doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (data.d.type && channel.type !== data.d.type) {
        // @ts-ignore
        channel = Channel.create(shard.client, {
          ...channel.toJSON(),
          ...data.d,
        });
      } else {
        channel._deserialise(data.d);
      }

      if (channel.guildId) {
        const guild = shard.client.guilds.get(channel.guildId);

        if (!guild) {
          shard.warn(
            `received channel update for ${data.d.id} but guild doesn't exist in cache; not setting in guild`,
          );
        } else {
          guild.channels.update(channel as GuildChannels);
        }
      }

      shard.client.channels.update(channel);

      manager.event('channelUpdate', channel, oldChannel);
      break;
    }
    case GatewayDispatchEvents.ChannelDelete: {
      const channel = shard.client.channels.get(data.d.id);

      if (!channel) break;

      if (channel.guildId) {
        const guild = shard.client.guilds.get(channel.guildId);

        if (!guild) {
          shard.warn(
            `received channel delete for ${data.d.id} but guild doesn't exist in cache; not removing from guild`,
          );
        } else {
          guild.channels.remove(channel.id);
        }
      }

      shard.client.channels.remove(channel.id);

      manager.event('channelDelete', channel);
      break;
    }
    //#endregion

    //#region Members
    case GatewayDispatchEvents.GuildMemberAdd: {
      const guild = shard.client.guilds.get(data.d.guild_id);

      if (!guild) {
        shard.warn(
          `received member add for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      const member = new GuildMember(shard.client, guild.id)._deserialise(
        data.d,
      );

      guild.members.add(member);

      manager.event('guildMemberAdd', member);
      break;
    }
    case GatewayDispatchEvents.GuildMemberUpdate: {
      const guild = shard.client.guilds.get(data.d.guild_id);

      if (!guild) {
        shard.warn(
          `received member update for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      const member = guild.members.get(data.d.user.id);

      if (!member) {
        shard.warn(
          `received member update for ${data.d.user.id} but member doesn't exist in cache; ignoring`,
        );
        break;
      }

      member._deserialise(data.d as APIGuildMember);

      guild.members.update(member);

      manager.event('guildMemberUpdate', member);
      break;
    }
    case GatewayDispatchEvents.GuildMemberRemove: {
      const guild = shard.client.guilds.get(data.d.guild_id);

      if (!guild) {
        shard.warn(
          `received member remove for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      guild.members.remove(data.d.user.id);

      manager.event('guildMemberRemove', data.d.user.id);
      break;
    }

    case GatewayDispatchEvents.GuildMembersChunk: {
      const guild = shard.client.guilds.get(data.d.guild_id);

      if (!guild) {
        shard.warn(
          `received member chunk for ${data.d.guild_id} but guild doesn't exist in cache; ignoring`,
        );
        break;
      }

      for (const member of data.d.members) {
        const memberInstance = new GuildMember(
          shard.client,
          guild.id,
        )._deserialise(member);

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
      const channel = shard.client.channels.get(data.d.channel_id);

      if (!channel) {
        shard.warn(
          `received message create for ${data.d.channel_id} but channel doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (!channel.isTextBased()) {
        shard.warn(
          `received message create for ${data.d.channel_id} but channel is not a text channel; ignoring`,
        );
        break;
      }

      const message = new Message(shard.client)._deserialise(data.d);

      channel.messages.add(message);

      manager.event('messageCreate', message);
      break;
    }
    case GatewayDispatchEvents.MessageUpdate: {
      const channel = shard.client.channels.get(data.d.channel_id);

      if (!channel) {
        shard.warn(
          `received message update for ${data.d.channel_id} but channel doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (!channel.isTextBased()) {
        shard.warn(
          `received message update for ${data.d.channel_id} but channel is not a text channel; ignoring`,
        );
        break;
      }

      const message = channel.messages.get(data.d.id);
      const oldMessage = channel.messages.get(data.d.id);

      if (!message) {
        shard.warn(
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
      const channel = shard.client.channels.get(data.d.channel_id);

      if (!channel) {
        shard.warn(
          `received message delete for ${data.d.channel_id} but channel doesn't exist in cache; ignoring`,
        );
        break;
      }

      if (!channel.isTextBased()) {
        shard.warn(
          `received message delete for ${data.d.channel_id} but channel is not a text channel; ignoring`,
        );
        break;
      }

      const message = channel.messages.get(data.d.id);

      if (!message) {
        shard.warn(
          `received message delete for ${data.d.id} but message doesn't exist in cache; ignoring`,
        );
        break;
      }

      channel.messages.remove(message.id);

      manager.event('messageDelete', message);
      break;
    }

    default: {
      shard.warn(`unhandled dispatch event ${data.t}`);
      shard.trace(data.t, data.d);
    }
  }
}
