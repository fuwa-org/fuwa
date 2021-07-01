import { APIApplicationCommandInteractionData, APIApplicationCommandInteractionDataOption, APIInteraction, APIMessageComponentInteractionData, APIUnavailableGuild } from 'discord-api-types';
import { Client } from '../client.js';
import { InteractionType } from '../constants.js';
import { ApplicationCommandDataOption, Channel, InteractionData } from '../types.js';
import { Snowflake } from '../util/snowflake.js';
import { Application } from './Application.js';
import { Base } from './Base.js';
import { Guild } from './Guild.js';
import { User } from './User.js';
export declare class BaseInteraction extends Base<APIInteraction> {
    /** The user that sent the interaction */
    user: User;
    /** The {@link Application} the interaction this is for */
    application: Application;
    /** The ID of the interaction. */
    id: Snowflake;
    /** The type of the interaction */
    type: InteractionType;
    /** The guild the interaction was sent from */
    guild: Guild | APIUnavailableGuild | null;
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
    constructor(client: Client, data: APIInteraction, inst?: boolean);
    _patch(data: APIInteraction): void;
    static resolveData(client: Client, data: APIInteraction): ResolvedBaseInteraction;
    static fuwaify(client: Client, data: Partial<APIApplicationCommandInteractionData & APIMessageComponentInteractionData>): InteractionData;
    static switchTypesForOptions(options: APIApplicationCommandInteractionDataOption[]): ApplicationCommandDataOption[];
}
interface ResolvedBaseInteraction {
    channel: Channel;
    application: Application;
    user: User;
    guild?: Guild | APIUnavailableGuild;
}
export {};
