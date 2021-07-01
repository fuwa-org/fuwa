import Collection from '@discordjs/collection';
import {
  APIApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataOption,
  APIDMInteraction,
  APIGuildInteraction,
  APIInteraction,
  APIMessageComponentInteractionData,
  APIUnavailableGuild,
  ApplicationCommandOptionType,
  ComponentType,
} from 'discord-api-types';
import { Client } from '../client.js';
import { ERRORS, InteractionType } from '../constants.js';
import {
  ApplicationCommandData,
  ApplicationCommandDataOption,
  Channel,
  InteractionData,
  MessageComponentInteractionData,
} from '../types.js';
import { Snowflake } from '../util/snowflake.js';
import { Application } from './Application.js';
import { Base } from './Base.js';
import { Guild } from './Guild.js';
import { User } from './User.js';

export class BaseInteraction extends Base<APIInteraction> {
  /** The user that sent the interaction */
  user: User;
  /** The {@link Application} the interaction this is for */
  application: Application;
  /** The ID of the interaction. */
  id: Snowflake;
  /** The type of the interaction */
  type: InteractionType;
  /** The guild the interaction was sent from */
  guild: Guild | APIUnavailableGuild | null = null;
  /**
   * The interaction's data: the ID of buttons pressed,
   * the values of select menu options chosen, the
   * command's arguments
   */
  data?: InteractionData;
  /**
   * The channel the interaction was sent from
   */
  channel: Channel;
  /**
   * A continuation token for responding to the interaction
   */
  token: string;
  /** Always `1` */
  readonly version = 1;
  constructor(client: Client, data: APIInteraction, inst = true) {
    super(client, data, false);
    if (inst) throw ERRORS.BASE_CLASS_USAGE;
    this._patch(data);
  }
  _patch(data: APIInteraction) {
    Object.defineProperty(this, 'token', {
      value: data.token,
      enumerable: false,
    });
    Object.assign(this, BaseInteraction.resolveData(this.client, data));
    // what the heck is this error
    this.data = BaseInteraction.fuwaify(this.client, data.data);
  }
  static resolveData(client: Client, data: APIInteraction) {
    let obj: ResolvedBaseInteraction = {
      channel: client.channels.get(data.channel_id),
      application: client.application,
      user: client.users.get(
        (<APIDMInteraction>data).user
          ? (<APIDMInteraction>data).user.id
          : (<APIGuildInteraction>data).member.user.id
      ),
      guild: (<APIGuildInteraction>data).guild_id
        ? client.guilds.get((<APIGuildInteraction>data).guild_id)
        : null,
    };
    return obj;
  }
  static fuwaify(
    client: Client,
    data: Partial<
      APIApplicationCommandInteractionData & APIMessageComponentInteractionData
    >
  ) {
    let obj: Partial<ApplicationCommandData & MessageComponentInteractionData>;
    if (data.custom_id) {
      obj.customID = data.custom_id;
    }
    if (data.component_type) {
      switch (data.component_type) {
        case ComponentType.Button:
          obj.componentType = 'button';
          break;
        case ComponentType.SelectMenu:
          obj.componentType = 'selectMenu';
          break;
        default:
          console.error(
            'Unknown message component type encountered on interaction'
          );
          break;
      }
    }
    if (data.id) obj.id = data.id;
    if (data.name) obj.name = data.name;
    if (data.options)
      obj.options = BaseInteraction.switchTypesForOptions(data.options);
    if (data.resolved)
      obj.resolved = Object.fromEntries(
        Object.entries(data.resolved).map(([K, V]) => {
          return [K, new Collection(Object.entries(V))];
        })
      );
    return obj as InteractionData;
  }
  static switchTypesForOptions(
    options: APIApplicationCommandInteractionDataOption[]
  ) {
    const types = [
      null,
      'subCommand',
      'subcommandGroup',
      'string',
      'integer',
      'boolean',
      'user',
      'channel',
      'role',
      'mentionable',
    ];
    return options.map((v) => ({
      ...v,
      type: types[v.type],
    })) as unknown as ApplicationCommandDataOption[];
  }
}

interface ResolvedBaseInteraction {
  channel: Channel;
  application: Application;
  user: User;
  guild?: Guild | APIUnavailableGuild;
}
