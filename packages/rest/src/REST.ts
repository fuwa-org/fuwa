// noinspection GrazieInspection
// TODO: use endpoints from discord-api-types

import * as Api from 'discord-api-types/v10';
import Dispatcher from 'undici/types/dispatcher';

import { APIRequest, File as FileData } from './client/APIRequest';
import {
  RequestManager,
  RequestManagerOptions,
  RouteLike,
} from './managers/RequestManager';
import { RESTClient, RESTClientOptions } from './client/RESTClient';
import { createDataURL as createDataURI } from './util';
import { parseErr } from './error';

/**
 * Additional options for the request.
 *
 * @example
 * await client.getCurrentUser({
 *   headers: {
 *     "user-agent": "DiscordBot (https://github.com/fuwa-org/fuwa; v1.2.3) Extra-Data/v1.2.3",
 *     "x-my-header": "i love using fuwa"
 *   }
 * })
 */
export interface RequestOptions<T = any, Q = Record<string, any>>
  extends Partial<Omit<APIRequest<T, Q>, 'route'>> {
  /**
   * Whether to treat the response body as an {@link ArrayBuffer} (binary). The
   * response will be a {@link Buffer} object if true.
   */
  buf?: boolean;
  /**
   * Manually override the route to be fetched for this query.
   *
   * @example
   * await client.getGateway({
   *   route: '/gateway/bot'
   * });
   * // however in this case there already is a function for it
   * await client.getGatewayBot();
   */
  route?: string;
}
export interface LocalizedRequestOptions<T = any, Q = Record<string, any>>
  extends RequestOptions<T, Q> {
  withLocalizations?: boolean;
}
export interface WebhookRequestOptions<T = any, Q = Record<string, any>>
  extends Omit<RequestOptions<T, Q>, 'useAuth' | 'auth'> {
  threadId?: boolean;
}
export interface BearerAuthenticatedOptions<T = any, Q = Record<string, any>>
  extends Omit<RequestOptions<T, Q>, 'auth'> {
  auth: `Bearer ${string}`;
}
export interface BotRequestOptions<T = any, Q = Record<string, any>>
  extends Omit<RequestOptions<T, Q>, 'auth'> {
  /**
   * Bot token to use for this request. Defaults to the client's already set token.
   */
  auth?: `Bot ${string}`;
}

type Awaitable<T> = Promise<T> | T;
type File = Required<Omit<FileData, 'key'>>;

// noinspection JSUnusedGlobalSymbols
/**
 * A simple, typed runtime REST wrapper for Discord,
 * exposing the documented endpoints in a type-safe way.
 *
 * @example
 * const client = new REST(process.env.DISCORD_TOKEN);
 *
 * const user = client.getCurrentUser();
 * // { username: "fuwa_l0ver", id: "12933829123212", ... }
 *
 * @class
 * @constructor
 */
export class REST extends RequestManager {
  //#region Configuration

  /**
   * Utility function to modify every request's options before sending them. Options cannot be deleted with the `delete` operator,
   * pass `undefined`.
   *
   * @returns The new options for the request, if any.
   * @private
   */
  private beforeRequest:
    | (<T>(options: RequestOptions<T>) => Awaitable<void | RequestOptions<T>>)
    | undefined = undefined;
  /**
   * Handle the result of a request.
   *
   * @returns {Awaitable<void>} Any result value will be ignored.
   * @private
   */
  private afterRequest:
    | ((
        options: RequestOptions,
        response: Dispatcher.ResponseData,
        text: string,
        json: any | null,
      ) => Awaitable<void>)
    | undefined = undefined;

  /**
   * Create a new REST client.
   * @param [token] Discord token to use, if any.
   * @param [options] Client options for the underlying {@link RESTClient|REST client}.
   * @param [managerOptions] Options for the {@link RequestManager|rate limit manager} (logging)
   */
  constructor(
    token: string | undefined = process.env.DISCORD_TOKEN,
    options: RESTClientOptions = RESTClient.getDefaultOptions(),
    managerOptions: RequestManagerOptions = {},
  ) {
    Object.assign(options, RESTClient.getDefaultOptions());

    options.auth = token;

    super(new RESTClient(options), managerOptions);
  }

  /**
   * Set the authentication token for requests to use. Tokens require a
   * token type, must be `Bot` or `Bearer`.
   */
  public set token(token: string | null) {
    if (token) {
      this.client.setAuth(token);
    } else if (token === null) {
      this.client.setAuth(undefined);
    }
  }

  /**
   * Get the current auth token. This token will always be prefixed
   * with `Bot` or `Bearer`. Using user accounts to access the Discord API is against
   * the [Terms of Service](https://discord.com/terms).
   * @returns The client's authentication token.
   */
  public get token() {
    return this.client.getAuth() ?? null;
  }

  /**
   * Set the authentication token for requests to use. Tokens require a
   * token type, must be `Bot` or `Bearer`.
   *
   * @returns The updated REST manager.
   */
  setToken(token?: string | null) {
    if (token !== undefined) this.token = token;

    return this;
  }

  /**
   * Get the current auth token. This token will always be prefixed
   * with `Bot` or `Bearer`. Using user accounts to access the Discord API is against
   * the [Terms of Service](https://discord.com/terms).
   * @returns The client's authentication token.
   */
  public getToken(): string | undefined {
    return this.client.getAuth();
  }

  /**
   * Set a task to be run before a request is sent. The task is passed the
   * request options, and is expected to return `undefined` _or_ modified
   * options.
   * @param cb Task to run before a request is sent.
   * @returns The REST client instance.
   */
  public setBefore(cb: REST['beforeRequest']) {
    this.beforeRequest = cb;
    return this;
  }

  /**
   * Set a task to be run after a request is sent. The task is passed the
   * request options, the response data and parsed JSON from the response, and
   * is not expected to return anything.
   * @param cb Task to run after a request is sent.
   * @returns The REST client instance.
   */
  public setAfter(cb: REST['afterRequest']) {
    this.afterRequest = cb;
    return this;
  }

  //#endregion

  //#region Methods

  /**
   * Send a request to the Discord API
   * @param options Request data to send alongside boilerplate headers
   * @returns JSON response from the API
   * @internal
   */
  private async request<T = unknown, B = any>(
    options: RequestOptions<B> & Required<Pick<APIRequest<B>, 'route'>>,
  ): Promise<T> {
    const token = this.client.getAuth();
    if (token && !token.startsWith('Bot ') && !token.startsWith('Bearer ')) {
      this.client.setAuth(`Bot ${token}`);
    }

    const task = await this.beforeRequest<B>?.(options);

    if (task && typeof task === 'object' && !Array.isArray(task)) {
      options = Object.assign(task, options);
    }

    const res = await this.queue<T, B>(options);

    if (options.buf)
      return res.body.arrayBuffer().then(Buffer.from) as Promise<T>;

    const text = await res.body.text();

    let json = null as any;

    try {
      json = JSON.parse(text);
    } catch (e) {
      // the JSON response was invalid or empty

      if (text.length) {
        throw parseErr(
          options,
          res,
          new TypeError('Invalid JSON response'),
          new TypeError(
            'An invalid JSON response was returned by Discord. This is likely an internal error, please report it as a bug.',
          ).stack,
        );
      } else if (res.statusCode !== 204) {
        this.debug(
          'An empty body was returned for a non-204 response:',
          options.route,
        );
      }
    }

    await this.afterRequest?.(options, res, text, json);

    return json;
  }

  /**
   * Send a HTTP GET request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are ignored.
   * @returns JSON response from the API
   */
  get<T>(route: RouteLike, options?: RequestOptions) {
    if (options?.body) {
      delete options.body;
    }
    if (options?.files) {
      delete options.files;
    }

    return this.request<T>({
      method: 'GET',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP POST request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are merged if
   *     both
   * are supplied, using different strategies for `body` depending on
   * {@link RequestOptions.payloadJson}.
   * @returns JSON response from the API
   */
  post<T>(route: RouteLike, options: RequestOptions = {}) {
    return this.request<T>({
      method: 'POST',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP PUT request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are treated
   *     like
   * in {@link REST.post}.
   * @returns JSON response from the API
   */
  put<T>(route: RouteLike, options: RequestOptions = {}) {
    return this.request<T>({
      method: 'PUT',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP PATCH request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are treated
   *     like
   * in {@link REST.post}.
   * @returns JSON response from the API
   */
  patch<T>(route: RouteLike, options: RequestOptions = {}) {
    return this.request<T>({
      method: 'PATCH',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP DELETE request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are ignored.
   * @returns JSON/empty response from the API, usually 204 No Content therefore
   *     empty
   */
  delete<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'DELETE',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP OPTIONS request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options.
   */
  options<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'OPTIONS',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP HEAD request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options.
   * @returns Empty response from the API, headers are consumed internally.
   */
  head<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'HEAD',
      route,
      ...options,
    });
  }

  //#endregion

  //#region Application Commands

  /**
   * Fetch all the global commands for your application.
   *
   * @returns An array of application command objects.
   *
   * @param applicationId Application ID to fetch commands for
   * @param options Additional options for the request
   * @param [options.withLocalizations] Whether to include all localizations for the commands.
   * @param [options.locale] The locale to fetch commands for. If set, will only return localizations for this language.
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#retrieving-localized-commands
   * @see https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands
   */
  getGlobalApplicationCommands(
    applicationId: string,
    options: LocalizedRequestOptions = {},
  ) {
    const { withLocalizations, locale, ...params } = options;

    if (withLocalizations && locale)
      throw new TypeError('Cannot specify both `localizations` or `locale`');

    return this.get<Api.RESTGetAPIApplicationCommandsResult>(
      `/applications/${applicationId}/commands`,
      {
        locale,
        ...params,
        query: {
          with_localizations: withLocalizations,
          ...params.query,
        },
      },
    );
  }

  /**
   * Create a new global command.
   *
   * - Creating a command with the same name as an existing command for your
   * application will overwrite the old command.
   *
   * @returns An application command object.
   *
   * @param applicationId Application ID to create the command for
   * @param data Data for the command
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
   */
  createGlobalApplicationCommand(
    applicationId: string,
    data: Api.RESTPostAPIApplicationCommandsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIApplicationCommandsResult>(
      `/applications/${applicationId}/commands`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Fetch a global command for your application.
   *
   * @returns An application command object.
   *
   * @param applicationId Application ID to fetch the command for
   * @param commandId Command ID to fetch
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#get-global-application-command
   */
  getGlobalApplicationCommand(
    applicationId: string,
    commandId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIApplicationCommandResult>(
      `/applications/${applicationId}/commands/${commandId}`,
      options,
    );
  }

  /**
   * Edit a global command.
   *
   * @returns Returns an application command object.
   *
   * @param applicationId Application ID to edit the command for
   * @param commandId Command ID to edit
   * @param data New command data. All fields are optional, but any fields provided will entirely overwrite the existing values of those fields
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#edit-global-application-command.
   */
  editGlobalApplicationCommand(
    applicationId: string,
    commandId: string,
    data: Api.RESTPatchAPIApplicationCommandJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIApplicationCommandResult>(
      `/applications/${applicationId}/commands/${commandId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Delete a global command.
   *
   * @returns 204 No Content on success.
   *
   * @param applicationId Application ID to delete the command for
   * @param commandId Command ID to delete
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#delete-global-application-command
   */
  deleteGlobalApplicationCommand(
    applicationId: string,
    commandId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<never>(
      `/applications/${applicationId}/commands/${commandId}`,
      options,
    );
  }

  /**
   * Takes a list of application commands, overwriting the existing global
   * command list for this application.
   *
   * Commands that do not already exist will count toward daily application
   * command create limits.
   *
   * @returns A list of application command objects.
   *
   * @param applicationId Application ID to overwrite
   * @param data New commands
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
   */
  bulkOverwriteGlobalApplicationCommands(
    applicationId: string,
    data: Api.RESTPutAPIApplicationCommandsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIApplicationCommandsResult>(
      `/applications/${applicationId}/commands`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Fetch all the guild commands for your application for a specific guild.
   *
   * @returns An array of application command objects.
   *
   * @param applicationId Application ID to fetch commands for
   * @param guildId Guild ID to fetch commands for
   * @param options Additional options for the request
   * @param [options.withLocalizations] Whether to include all localizations for the commands.
   * @param [options.locale] The locale to fetch commands for. If set, will only return localizations for this language.
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands
   */
  getGuildApplicationCommands(
    applicationId: string,
    guildId: string,
    options: LocalizedRequestOptions = {},
  ) {
    const { withLocalizations, locale, ...params } = options;

    if (withLocalizations && locale)
      throw new TypeError('Cannot specify both `localizations` or `locale`');

    return this.get<Api.RESTGetAPIApplicationCommandsResult>(
      `/applications/${applicationId}/guilds/${guildId}/commands`,
      {
        locale,
        query: {
          with_localizations: withLocalizations,
        },
        ...params,
      },
    );
  }

  /**
   * Create a new guild command. New guild commands will be available in the guild immediately.
   *
   * - Creating a command with the same name as an existing command for your
   * application will overwrite the old command.
   *
   * @returns An application command object.
   *
   * @param applicationId Application ID to create the command for
   * @param guildId Guild ID to create the command for
   * @param data Data for the command
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command
   */
  createGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    data: Api.RESTPostAPIApplicationCommandsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIApplicationCommandsResult>(
      `/applications/${applicationId}/guilds/${guildId}/commands`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Fetch a guild command for your application.
   *
   * @returns An application command object.
   *
   * @param applicationId Application ID to fetch the command for
   * @param guildId Guild ID to fetch the command for
   * @param commandId Command ID to fetch
   * @param [options] Additional options for the request
   * @param [options.locale] The locale to fetch commands for. If set, will only return localizations for this language.
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command
   */
  getGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    commandId: string,
    options: LocalizedRequestOptions = {},
  ) {
    const { withLocalizations, locale, ...params } = options;

    if (withLocalizations && locale) {
      throw new TypeError('Cannot specify both `localizations` and `locale`');
    }

    return this.get<Api.RESTGetAPIApplicationCommandResult>(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      {
        ...params,
        locale,
        query: {
          with_localizations: withLocalizations,
          ...params.query,
        },
      },
    );
  }

  /**
   * Edit a guild command.
   *
   * @returns Returns an application command object.
   *
   * @param applicationId Application ID to edit the command for
   * @param guildId Guild ID to edit the command for
   * @param commandId Command ID to edit
   * @param data New command data. All fields are optional, but any fields
   * provided will entirely overwrite the existing values of those fields
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command
   */
  editGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    commandId: string,
    data: Api.RESTPatchAPIApplicationCommandJSONBody,
    options?: RequestOptions,
  ) {
    return this.patch<Api.RESTPatchAPIApplicationCommandResult>(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Delete a guild command.
   *
   * @returns 204 No Content on success.
   *
   * @param applicationId Application ID to delete the command for
   * @param guildId Guild ID to delete the command for
   * @param commandId Command ID to delete
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#delete-guild-application-command
   */
  deleteGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    commandId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<never>(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      options,
    );
  }

  /**
   * Takes a list of application commands, overwriting the existing command list
   * for this application for the targeted guild.
   *
   * This will overwrite all types of application commands: slash commands, user
   * commands, and message commands.
   *
   * @returns A list of application command objects.
   *
   * @param applicationId Application ID to overwrite commands for
   * @param guildId Guild ID to overwrite commands in
   * @param data New commands
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands
   */
  bulkOverwriteGuildApplicationCommands(
    applicationId: string,
    guildId: string,
    data: Api.RESTPutAPIApplicationCommandsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIApplicationCommandsResult>(
      `/applications/${applicationId}/guilds/${guildId}/commands`,
      {
        body: data,

        ...options,
      },
    );
  }

  bulkEditGuildApplicationCommands = this.bulkOverwriteGuildApplicationCommands;

  /**
   * Fetches permissions for all commands for your application in a guild.
   *
   * @returns An array of guild application command permissions objects.
   *
   * @param applicationId Application ID to fetch permissions for
   * @param guildId Guild ID to fetch permissions in
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command-permissions
   */
  getGuildApplicationCommandPermissions(
    applicationId: string,
    guildId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIApplicationCommandPermissionsResult[]>(
      `/applications/${applicationId}/guilds/${guildId}/commands/permissions`,
      options,
    );
  }

  /**
   * Fetch permissions for a specific command for your application in a guild.
   *
   * @returns A guild application command permissions object.
   *
   * @param applicationId Application ID to fetch permissions for
   * @param guildId Guild ID to fetch permissions in
   * @param commandId Command ID to fetch
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/application-commands#get-application-command-permissions
   */
  getApplicationCommandPermissions(
    applicationId: string,
    guildId: string,
    commandId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIApplicationCommandPermissionsResult>(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
      options,
    );
  }

  /**
   * Edits command permissions for a specific command for your application in a
   * guild.
   *
   * - This endpoint will overwrite existing permissions for the command in that
   * guild.
   * - You can add up to 100 permission overwrites for a command.
   * - This endpoint requires authentication with a Bearer token that has
   * permission to manage the guild and its roles. For more information, [read
   * about application command permissions.](https://discord.com/developers/docs/interactions/application-commands#permissions)
   * - Deleting or renaming a command will permanently delete all permissions for the command
   *
   * Fires an Application Command Permissions Update Gateway event.
   *
   * @returns A guild application command permissions object.
   *
   * @param applicationId Application ID to edit permissions for
   * @param guildId Guild ID to edit permissions in
   * @param commandId Command ID to edit
   * @param data New permissions data
   * @param options Additional options for the request
   * @param options.auth Authentication token for the request. Must be fully
   * qualified, i.e. `Bearer ...`
   *
   * @example Using OAuth2
   * await client.editApplicationCommandPermissions(
   *    "my-app-id",
   *    "my-guild-id",
   *    "my-command-id",
   *    [{
   *      id: "@everyone",
   *      type: 1,
   *      permission: true
   *    }],
   *    {
   *      auth: "Bearer TOKEN"
   *    }
   * )
   *
   *
   * @see https://discord.com/developers/docs/change-log#upcoming-application-command-permission-changes
   * @see https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions
   */
  editApplicationCommandPermissions(
    applicationId: string,
    guildId: string,
    commandId: string,
    data: Api.RESTPutAPIApplicationCommandPermissionsJSONBody,
    options: BearerAuthenticatedOptions,
  ) {
    return this.put<Api.RESTPutAPIApplicationCommandPermissionsResult>(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`,
      {
        body: data,
        ...options,
      },
    );
  }

  //#endregion

  //#region Interactions

  /**
   * Create a response to an Interaction from the gateway.
   *
   * @returns 204 No Content.
   *
   * @param interactionId Interaction to respond to.
   * @param token Interaction token
   * @param data Response data to send.
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response
   */
  createInteractionResponse(
    interactionId: string,
    token: string,
    data: Api.RESTPostAPIInteractionCallbackJSONBody,
    options: WebhookRequestOptions = {},
  ) {
    return this.post<never>(
      `/interactions/${interactionId}/${token}/callback`,
      {
        body: data,
        useAuth: false,
        ...options,
      },
    );
  }

  /**
   * Returns the initial Interaction response. Functions the same as {@link REST.getWebhookMessage Get Webhook Message}.
   *
   * @param applicationId Application ID that responded to the interaction
   * @param interactionToken Interaction token
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response
   */
  getOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string,
    options: WebhookRequestOptions = {},
  ) {
    return this.getWebhookMessage(
      applicationId,
      interactionToken,
      '@original',
      options,
    );
  }

  /**
   * Edits the initial Interaction response. Functions the same as {@link REST.editWebhookMessage Edit Webhook Message}.
   *
   * @param applicationId Application ID that responded to the interaction
   * @param interactionToken Interaction token
   * @param data New response data
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response
   */
  editOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string,
    data: Api.RESTPatchAPIInteractionOriginalResponseJSONBody,
    options: WebhookRequestOptions = {},
  ) {
    return this.editWebhookMessage(
      applicationId,
      interactionToken,
      '@original',
      data,
      options,
    );
  }

  /**
   * Deletes the initial Interaction response.
   *
   * @returns 204 No Content on success.
   *
   * @param applicationId
   * @param interactionToken
   * @param options
   */
  deleteOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string,
    options: WebhookRequestOptions = {},
  ) {
    return this.deleteWebhookMessage(
      applicationId,
      interactionToken,
      '@original',
      options,
    );
  }

  /**
   * Create a followup message for an Interaction.
   *
   * - Functions the same as Execute Webhook, but `wait` is always true.
   * - The `thread_id`, `avatar_url`, and `username` parameters are not supported
   * when using this endpoint for interaction followups.
   *
   * `flags` can be set to 64 to mark the message as
   * {@link import('discord-api-types/v10').MessageFlags.Ephemeral ephemeral},
   * except when it is the first followup message to a deferred Interaction's
   * Response. In that case, the `flags` field will be ignored, and the
   * ephemerality of the message will be determined by the `flags` value in your
   * original ACK.
   *
   * @returns A message object.
   *
   * @param applicationId Application ID creating the followup message
   * @param interactionToken Interaction token
   * @param data Followup message data
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#create-followup-message
   */
  createFollowupMessage(
    applicationId: string,
    interactionToken: string,
    data: Api.RESTPostAPIInteractionFollowupJSONBody,
    options: WebhookRequestOptions,
  ): Promise<
    ReturnType<REST['executeWebhook']> extends Promise<infer T | null>
      ? T
      : never
  > {
    return this.executeWebhook(
      applicationId,
      interactionToken,
      data,
      options,
    ).then(res => res!);
  }

  /**
   * Returns a followup message for an Interaction. Functions the same as
   * {@link REST.getWebhookMessage Get Webhook Message}.
   *
   * @param applicationId Application ID creating the followup message
   * @param interactionToken Interaction token
   * @param messageId Message ID
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#get-followup-message
   */
  getFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string,
    options: RequestOptions = {},
  ) {
    return this.getWebhookMessage(
      applicationId,
      interactionToken,
      messageId,
      options,
    );
  }

  /**
   * Edits a followup message for an Interaction. Functions the same as {@link REST.editWebhookMessage Edit Webhook Message}.
   *
   * @param applicationId Application ID creating the followup message
   * @param interactionToken Interaction token
   * @param messageId Message ID
   * @param data Followup message data
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#edit-followup-message
   */
  editFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string,
    data: Api.RESTPatchAPIInteractionFollowupJSONBody,
    options: WebhookRequestOptions = {},
  ) {
    return this.editWebhookMessage(
      applicationId,
      interactionToken,
      messageId,
      data,
      options,
    );
  }

  /**
   * Deletes a followup message for an Interaction.
   *
   * @returns 204 No Content on success
   *
   * @param applicationId Application ID creating the followup message
   * @param interactionToken Interaction token
   * @param messageId Message ID
   * @param options
   *
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#delete-followup-message
   */
  deleteFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string,
    options: WebhookRequestOptions = {},
  ) {
    return this.deleteWebhookMessage(
      applicationId,
      interactionToken,
      messageId,
      options,
    );
  }

  //#endregion

  //#region Application Role Connection Metadata

  /**
   * @returns A list of application role connection metadata objects for the given application.
   *
   * @param applicationId The application to query records for.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records
   */
  getApplicationRoleConnectionMetadataRecords(
    applicationId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIApplicationRoleConnectionMetadataResult>(
      `/applications/${applicationId}/role-connections/metadata`,
      options,
    );
  }

  /**
   * Updates application role connection metadata objects for the given application.
   * @returns A list of application role connection metadata objects for the given application.
   *
   * @param applicationId The application to update records for.
   * @param data Records to update. Omitted records **will be deleted**.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records
   */
  updateApplicationRoleConnectionMetadataRecords(
    applicationId: string,
    data: Api.RESTPutAPIApplicationRoleConnectionMetadataJSONBody,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIApplicationRoleConnectionMetadataResult>(
      `/applications/${applicationId}/role-connections/metadata`,
      {
        body: data,

        ...options,
      },
    );
  }

  //#endregion

  //#region Audit Log

  /**
   * Returns an audit log object for the guild. Requires the VIEW_AUDIT_LOG permission.
   *
   * @param guildId The guild to fetch audit logs for.
   * @param options These parameters can be used to filter which and how many audit log entries are returned.
   *
   * The returned list of audit log entries is ordered based on whether you use before or after.
   * - When using `before`, the list is ordered by the audit log entry ID descending (newer entries
   *   first).
   * - If `after` is used, the list is reversed and appears in ascending order (older entries first).
   * - Omitting both `before` and `after` defaults to before the current timestamp and will show the
   *   most recent entries in descending order by ID, the opposite can be achieved using `after=0`
   *   (showing oldest entries).
   *
   * @see https://discord.com/developers/docs/resources/audit-log#get-guild-audit-log
   */
  getGuildAuditLog(
    guildId: string,
    options: Api.RESTGetAPIAuditLogQuery &
      RequestOptions<Api.RESTGetAPIAuditLogQuery> = {},
  ) {
    const { before, after, ...params } = options;

    return this.get<Api.RESTGetAPIAuditLogResult>(
      `/guilds/${guildId}/audit-logs`,
      {
        query: { before, after, ...params.query },
        ...params,
      },
    );
  }

  //#endregion

  //#region Auto Moderation

  /**
   * Get a list of all rules currently configured for the guild.
   * - This endpoint requires the `MANAGE_GUILD` permission.
   *
   * @returns A list of auto moderation rule objects for the given guild.
   *
   * @param guildId The guild to fetch auto moderation rules for.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/auto-moderation#list-auto-moderation-rules-for-guild
   */
  listAutoModerationRules(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIAutoModerationRulesResult>(
      `/guilds/${guildId}/auto-moderation/rules`,
      options,
    );
  }

  /**
   * Get a single rule.
   * - This endpoint requires the `MANAGE_GUILD` permission.
   * @returns An auto moderation rule object.
   *
   * @param guildId The guild to fetch the rule from.
   * @param autoModerationRuleId The auto moderation rule to fetch.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/auto-moderation#get-auto-moderation-rule
   */
  getAutoModerationRule(
    guildId: string,
    autoModerationRuleId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIAutoModerationRuleResult>(
      `/guilds/${guildId}/auto-moderation/rules/${autoModerationRuleId}`,
      options,
    );
  }

  /**
   * Create a new rule. Fires an `AUTO_MODERATION_RULE_CREATE` Gateway event.
   * - This endpoint requires the `MANAGE_GUILD` permission.
   * - This endpoint supports sending an Audit Log reason.
   *
   * @param guildId The guild to create the rule for.
   * @param data Rule data to create.
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @returns An auto moderation rule on success.
   * @see https://discord.com/developers/docs/resources/auto-moderation#create-auto-moderation-rule
   */
  createAutoModerationRule(
    guildId: string,
    data: Api.RESTPostAPIAutoModerationRuleJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIAutoModerationRuleResult>(
      `/guilds/${guildId}/auto-moderation/rules`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Modify an existing rule. Fires an `AUTO_MODERATION_RULE_UPDATE` Gateway event.
   * - Requires `MANAGE_GUILD` permissions.
   * - All parameters to this endpoint are optional.
   * - This endpoint supports sending an Audit Log reason.
   * @returns An auto moderation rule on success.
   * @param guildId The guild to update rules for.
   * @param ruleId The rule to update.
   * @param data Data to add to the rule.
   * @param options Additional options for the request
   * @param options.reason Reason to display in the guild's {@link REST.getGuildAuditLog audit log}.
   * @see https://discord.com/developers/docs/resources/auto-moderation#modify-auto-moderation-rule
   */
  modifyAutoModerationRule(
    guildId: string,
    ruleId: string,
    data: Api.RESTPatchAPIAutoModerationRuleJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIAutoModerationRuleResult>(
      `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Delete a rule. Fires an `AUTO_MODERATION_RULE_DELETE` Gateway event.
   * - This endpoint requires the MANAGE_GUILD permission.
   * - This endpoint supports sending an Audit Log reason.
   * @param guildId The guild to delete automod rules in.
   * @param ruleId The rule to delete.
   * @param options Additional options for the request.
   * @param options.reason Reason to display in the guild's {@link REST.getGuildAuditLog audit log}.
   * @see https://discord.com/developers/docs/resources/auto-moderation#delete-auto-moderation-rule
   */
  deleteAutoModerationRule(
    guildId: string,
    ruleId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIAutoModerationRuleResult>(
      `/guilds/${guildId}/auto-moderation/rules/${ruleId}`,
      options,
    );
  }

  //#endregion

  //#region Channel

  /**
   * Get a channel by ID.
   * - If the channel is a thread, a thread member object is included in the returned result.
   * @returns A channel object.
   *
   * @param id The channel to query.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#get-channel
   */
  getChannel(id: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIChannelResult>(`/channels/${id}`, options);
  }

  /**
   * Update a channel's settings.
   * - This endpoint supports sending an Audit Log reason.
   * @param id The channel to modify.
   * @param data Data to modify. All parameters are optional.
   * @param options Additional options for the request.
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}.
   * @returns A channel on success, and a 400 BAD REQUEST on invalid parameters.
   * @see https://discord.com/developers/docs/resources/channel#modify-channel
   */
  modifyChannel(
    id: string,
    data: Api.RESTPatchAPIChannelJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIChannelResult>(`/channels/${id}`, {
      body: data,
      ...options,
    });
  }

  /**
   * Delete a channel, or close a private message.
   * - Requires the `MANAGE_CHANNELS` permission for the guild, or `MANAGE_THREADS` if the channel is a
   * thread.
   * - Deleting a category does not delete its child channels; they will have their `parent_id` removed
   * and a `CHANNEL_UPDATE` Gateway event will fire for each of them.
   * - Fires a Channel Delete Gateway event (or Thread Delete if the channel was a thread).
   *
   * **Deleting a guild channel cannot be undone.** Use this with caution, as it is impossible to undo this
   * action when performed on a guild channel.
   *
   * In contrast, when used with a private message, it is possible to undo the action by opening a private
   * message with the recipient again.
   *
   * For Community guilds, the Rules or Guidelines channel and the Community Updates channel cannot be deleted.
   *
   * - This endpoint supports sending an Audit Log reason.
   * @returns The deleted channel object on success.
   * @param id The channel to delete.
   * @param options Additional options for the request.
   * @params [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}.
   * @see https://discord.com/developers/docs/resources/channel#deleteclose-channel
   */
  deleteChannel(id: string, options: RequestOptions = {}) {
    return this.delete<Api.RESTDeleteAPIChannelResult>(
      `/channels/${id}`,
      options,
    );
  }

  closeDM = this.deleteChannel;

  /**
   * Retrieves the messages in a channel.
   *
   * - If operating on a guild channel, this endpoint requires the current user to have the `VIEW_CHANNEL`
   * permission.
   * - If the channel is a voice channel, they must also have the `CONNECT` permission.
   * - If the current user is missing the `READ_MESSAGE_HISTORY` permission in the channel, then no
   * messages will be returned.
   * @returns An array of message objects on success.
   * @param channelId The channel to fetch messages in.
   * @param options Additional options for this request.
   * The {@link import('discord-api-types/v10').RESTGetAPIChannelMessagesQuery.before `before`},
   * {@link import('discord-api-types/v10').RESTGetAPIChannelMessagesQuery.after `after`}, and
   * {@link import('discord-api-types/v10').RESTGetAPIChannelMessagesQuery.around `around`} parameters are
   * mutually exclusive, only one may be passed at a time.
   * @see https://discord.com/developers/docs/resources/channel#get-channel-messages
   */
  getChannelMessages(
    channelId: string,
    options: Api.RESTGetAPIChannelMessagesQuery,
  ) {
    return this.get<Api.RESTGetAPIChannelMessagesResult>(
      `/channels/${channelId}/messages`,
      {
        query: options,
      },
    );
  }

  /**
   * Retrieves a specific message in the channel.
   *
   * - If operating on a guild channel, this endpoint requires the current user to have the `VIEW_CHANNEL`
   * and `READ_MESSAGE_HISTORY` permissions.
   * - If the channel is a voice channel, they must also have the `CONNECT` permission.
   *
   * @returns A message object on success.
   *
   * @param channelId The channel to fetch the message in.
   * @param messageId The message to fetch.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#get-channel-message
   */
  getChannelMessage(
    channelId: string,
    messageId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIChannelMessageResult>(
      `/channels/${channelId}/messages/${messageId}`,
      options,
    );
  }

  /**
   * Post a message to a guild text or DM channel.
   *
   * Fires a Message Create Gateway event. See [message
   * formatting](https://discord.com/developers/docs/reference#message-formatting) for more information on how
   * to properly format messages.
   *
   * To create a message as a reply to another message, apps can include a
   * {@link import('discord-api-types/v10').RESTPostAPIChannelMessageJSONBody['message_reference'] `message_reference`}
   * with a `message_id`.
   * The `channel_id` and `guild_id` in the `message_reference` are optional, but will be validated if provided.
   *
   * ## Limitations
   * - When operating on a guild channel, the current user must have the `SEND_MESSAGES` permission.
   * - When sending a message with `tts` (text-to-speech) set to true, the current user must have the
   *   `SEND_TTS_MESSAGES` permission.
   * - When creating a message as a reply to another message, the current user must have the `READ_MESSAGE_HISTORY`
   *   permission. The referenced message must exist and cannot be a system message.
   * - The maximum request size when sending a message is **25 MiB**.
   * - For the embed object, you can set every field except `type` (it will be rich regardless of if you try to set it),
   *   `provider`, `video`, and any `height`, `width`, or `proxy_url` values for images.
   *
   *
   * @returns A {@link import('discord-api-types/v10').APIMessage|message object}.
   *
   * @param channelId The channel to send the message in
   * @param data
   * @param files
   *
   * @see https://discord.com/developers/docs/resources/channel#create-message
   */
  createMessage(
    channelId: string,
    data: Api.RESTPostAPIChannelMessageJSONBody,
    files?: File[],
  ) {
    return this.post<Api.RESTPostAPIChannelMessageResult>(
      `/channels/${channelId}/messages`,
      {
        body: data,
        files,
      },
    );
  }

  /**
   * Crosspost a message in an Announcement Channel to following channels.
   *
   * Fires a Message Update Gateway event.
   * - This endpoint requires the `SEND_MESSAGES` permission, if the current user sent the message, or additionally
   *   the `MANAGE_MESSAGES` permission, for all other messages, to be present for the current user.
   * @returns A message object.
   *
   * @param channelId The channel to crosspost the message in.
   * @param messageId The message to crosspost.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#crosspost-message
   */
  crosspostMessage(
    channelId: string,
    messageId: string,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIChannelMessageCrosspostResult>(
      `/channels/${channelId}/messages/${messageId}/crosspost`,
      options,
    );
  }

  /**
   * Create a reaction for the message. Fires a Message Reaction Add Gateway event.
   *
   * - This endpoint requires the `READ_MESSAGE_HISTORY` permission to be present on the current user.
   * - Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the
   *   `ADD_REACTIONS` permission to be present on the current user.
   *
   * @throws {@link import('discord-api-types/v10').RESTJSONErrorCodes.UnknownEmoji `APIError[10014]: Unknown Emoji`} if the emoji is not url encoded or in the format `name:id`.
   * @returns A 204 empty response on success.
   *
   * @param channelId The channel to add the reaction to.
   * @param messageId The message to react to.
   * @param emoji The reaction itself
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#create-reaction
   */
  createReaction(
    channelId: string,
    messageId: string,
    emoji: string,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIChannelMessageReactionResult>(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji,
      )}/@me`,
      options,
    );
  }

  /**
   * Delete a reaction the current user has made for the message. Fires a `MESSAGE_REACTION_REMOVE` Gateway
   * event.
   * @returns A 204 empty response on success.
   * @throws {@link import('discord-api-types/v10').RESTJSONErrorCodes.UnknownEmoji `APIError[10014]: Unknown Emoji`} if the emoji is not url encoded or in the format `name:id`.
   *
   * @param channelId The channel to delete the reaction in
   * @param messageId Message ID the reaction is attached to
   * @param emoji Emoji, formatted as `name:id`.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#delete-own-reaction
   */
  deleteOwnReaction(
    channelId: string,
    messageId: string,
    emoji: string,
    options: RequestOptions = {},
  ) {
    return this.deleteUserReaction(channelId, messageId, emoji, '@me', options);
  }

  /**
   * Deletes another user's reaction. Fires a Message Reaction Remove Gateway event.
   * - This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user.
   * @returns A 204 empty response on success.
   * @throws {@link import('discord-api-types/v10').RESTJSONErrorCodes.UnknownEmoji `APIError[10014]: Unknown Emoji`} if the emoji is not url encoded or in the format `name:id`.
   *
   * @param channelId The channel to delete the reaction in
   * @param messageId Message ID the reaction is attached to
   * @param emoji Emoji, formatted as `name:id`
   * @param userId User to delete the reaction from
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#delete-own-reaction
   */
  deleteUserReaction(
    channelId: string,
    messageId: string,
    emoji: string,
    userId: string,
    options: RequestOptions = {},
  ) {
    return this.delete(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji,
      )}/${userId}`,
      options,
    );
  }

  /**
   * Get a list of users that reacted with this emoji.
   * @returns Returns an array of {@link import('discord-api-types/v10').APIUser|user objects} on
   * success.
   * @throws {@link import('discord-api-types/v10').RESTJSONErrorCodes.UnknownEmoji `APIError[10014]: Unknown Emoji`} if the emoji is not url encoded or in the format `name:id`.
   *
   * @param channelId The channel the message is in.
   * @param messageId Message to request the reactions for.
   * @param emoji The emoji to query.
   * @param options Additional request options.
   *
   * @param {string} [options.after] Get users after this user ID
   * @param {number} [options.limit=25] Max number of users to return (1-100)
   *
   * @see https://discord.com/developers/docs/resources/channel#get-reactions
   */
  getReactions(
    channelId: string,
    messageId: string,
    emoji: string,
    options?: Api.RESTGetAPIChannelMessageReactionUsersQuery,
  ) {
    return this.get<Api.RESTGetAPIChannelMessageReactionUsersResult>(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji,
      )}`,
      {
        query: options,
      },
    );
  }

  /**
   * Deletes all reactions on a message. Fires a `MESSAGE_REACTION_REMOVE_ALL` Gateway event.
   * - This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user.
   *
   * @param channelId Channel ID the message is in.
   * @param messageId The message to remove reactions for.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#delete-all-reactions
   */
  deleteAllReactions(
    channelId: string,
    messageId: string,
    options: RequestOptions = {},
  ) {
    return this.delete(
      `/channels/${channelId}/messages/${messageId}/reactions`,
      options,
    );
  }

  /**
   * Deletes all the reactions for a given emoji on a message. Fires a `MESSAGE_REACTION_REMOVE_EMOJI`
   * Gateway event.
   * - This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user.
   * @throws {@link import('discord-api-types/v10').RESTJSONErrorCodes.UnknownEmoji `APIError[10014]: Unknown Emoji`} if the emoji is not url encoded or in the format `name:id`.
   *
   * @param channelId The channel the message is in.
   * @param messageId The message to remove reactions for.
   * @param emoji The emoji to delete reactions for.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#delete-all-reactions-for-emoji
   */
  deleteAllReactionsForEmoji(
    channelId: string,
    messageId: string,
    emoji: string,
    options: RequestOptions = {},
  ) {
    return this.delete(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji,
      )}`,
      options,
    );
  }

  /**
   * Edit a previously sent message.
   *
   * - The fields `content`, `embeds`, and `flags` can be edited by the original message author.
   * Other users can only edit `flags` and only if they have the `MANAGE_MESSAGES` permission
   * in the corresponding channel.
   *
   * - When specifying flags, ensure to include all previously set flags/bits in addition to
   * ones that you are modifying. Only flags documented in the table below may be modified by
   * users (unsupported flag changes are currently ignored without error).
   *
   * - When the `content` field is edited, the
   * {@link import('discord-api-types/v10').APIMessage['mentions']|`mentions`} array in the
   * message object will be reconstructed from scratch based on the new content. The
   * `allowed_mentions` field of the edit request controls how this happens. If there is no
   * explicit `allowed_mentions` in the edit request, the content will be parsed with default
   * allowances, that is, without regard to whether or not an `allowed_mentions` was present in
   * the request that originally created the message.
   *
   * - Any provided files will be **appended** to the message.
   * **Make sure to include the `files` in
   * {@link Api.RESTPatchAPIChannelMessageJSONBody['attachments']|`data.attachments`} or they will be ignored.**
   *
   * - Starting with API v10 (default version), the attachments array must contain all attachments that
   * should be present after edit, including retained and new attachments provided in the request body.
   *
   * - All parameters to this endpoint are optional and nullable.
   *
   * @returns A message object. Fires a `MESSAGE_UPDATE` Gateway event.
   *
   * @param channelId The channel this message is in.
   * @param messageId The message to update.
   * @param data New message data.
   * @param [files] Files to include in the request. This does not add them to `data.attachments`.
   *
   * @see https://discord.com/developers/docs/resources/channel#edit-message
   */
  editMessage(
    channelId: string,
    messageId: string,
    data: {
      [key in keyof Api.RESTPatchAPIChannelMessageJSONBody]:
        | Api.RESTPatchAPIChannelMessageJSONBody[key]
        | null;
    },
    files?: File[],
  ) {
    return this.patch<Api.RESTPatchAPIChannelMessageResult>(
      `/channels/${channelId}/messages/${messageId}`,
      {
        body: data,
        files,
      },
    );
  }

  /**
   * Delete a message.
   *
   * If operating on a guild channel and trying to delete a message that was not sent
   * by the current user, this endpoint requires the `MANAGE_MESSAGES` permission.
   *
   * Fires a `MESSAGE_DELETE` gateway event.
   * This endpoint supports sending an Audit Log reason.
   * @returns An empty response on success.
   *
   * @param channelId The channel the message is in.
   * @param messageId The message to delete.
   * @param options Additional options for the request.
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#delete-message
   */
  deleteMessage(
    channelId: string,
    messageId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIChannelMessageResult>(
      `/channels/${channelId}/messages/${messageId}`,
      options,
    );
  }

  /**
   * Bulk delete up to 100 messages in a channel.
   *
   * - Any message IDs given that do not exist or are invalid will count towards
   * the minimum and maximum message count (currently 2 and 100 respectively).
   *
   * - This endpoint can only be used on guild channels and requires the
   * `MANAGE_MESSAGES` permission.
   *
   * - This endpoint will not delete messages older than 2 weeks, and will fail
   * with a `400 BAD REQUEST` if any message provided is older than that or if
   * any duplicate message IDs are provided.
   *
   * - This endpoint supports sending an Audit Log reason
   *
   * @param channelId The channel to delete messages in.
   * @param messages Message IDs to delete. Elements cannot be older than 14
   * days (2 weeks).
   * @param options Additional request options
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#bulk-delete-messages
   */
  bulkDeleteMessages(
    channelId: string,
    messages: string[],
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIChannelMessagesBulkDeleteResult>(
      `/channels/${channelId}/messages/bulk-delete`,
      {
        body: {
          messages,
        },
        ...options,
      },
    );
  }

  // noinspection GrazieInspection
  /**
   * Edit the channel permission overwrites for a user or role in a channel.
   *
   * - Only usable for guild channels.
   * - Requires the MANAGE_ROLES permission.
   * - Only permissions your bot has in the guild or parent channel (if
   * applicable) can be allowed/denied (unless your bot has a `MANAGE_ROLES`
   * overwrite in the channel).
   *
   * Fires a `CHANNEL_UPDATE` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId The channel to update overwrites for.
   * @param overwriteId The overwrite to update.
   * @param data New permission data for the overwrite.
   * @param options Additional options for the request.
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#edit-channel-permissions
   * @see https://discord.com/developers/docs/topics/permissions#permissions
   */
  editChannelPermissions(
    channelId: string,
    overwriteId: string,
    data: Api.RESTPutAPIChannelPermissionJSONBody,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIChannelPermissionResult>(
      `/channels/${channelId}/permissions/${overwriteId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Returns a list of invite objects (with invite metadata) for the channel.
   *
   * - Only usable for guild channels.
   * - Requires the `MANAGE_CHANNELS` permission.
   *
   * @param channelId The channel to query objects for.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#get-channel-invites
   */
  getChannelInvites(channelId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIChannelInvitesResult>(
      `/channels/${channelId}/invites`,
      options,
    );
  }

  /**
   * Create a new invite object for the channel.
   *
   * - Only usable for guild channels.
   * - Requires the `CREATE_INSTANT_INVITE` permission.
   * - All JSON parameters for this route are optional, however the request body
   * is not. If you are not sending any fields, you still have to send an empty
   * JSON object (`{}`).
   * - This endpoint supports sending an Audit Log reason.
   *
   * Fires an `INVITE_CREATE` Gateway event.
   *
   * @returns An invite object.
   *
   * @param channelId The channel to create an invite for.
   * @param data Invite data to create.
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#create-channel-invite
   */
  createChannelInvite(
    channelId: string,
    data: Api.RESTPostAPIChannelInviteJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIChannelInviteResult>(
      `/channels/${channelId}/invites`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Delete a channel permission overwrite for a user or role in a channel.
   *
   * - Only usable for guild channels.
   * - Requires the `MANAGE_ROLES` permission.
   * - This endpoint supports sending an Audit Log reason.
   *
   * Fires a `CHANNEL_UPDATE` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId The channel to delete permissions for.
   * @param overwriteId The overwrite to delete.
   * @param options Additional options for the request.
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#delete-channel-permission
   * @see https://discord.com/developers/docs/topics/permissions#permissions
   */
  deleteChannelPermission(
    channelId: string,
    overwriteId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIChannelPermissionResult>(
      `/channels/${channelId}/permissions/${overwriteId}`,
      options,
    );
  }

  /**
   * Follow an Announcement Channel to send messages to a target channel.
   *
   * - Requires the `MANAGE_WEBHOOKS` permission in the target channel.
   *
   * Fires a `WEBHOOKS_UPDATE` Gateway event for the target channel.
   *
   * @returns A followed channel object.
   *
   * @param channelId The channel to be followed.
   * @param webhookChannelId The channel the announcements should be cross-posted
   * to.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#follow-announcement-channel
   */
  followAnnouncementChannel(
    channelId: string,
    webhookChannelId: string,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIChannelFollowersResult>(
      `/channels/${channelId}/followers`,
      {
        ...options,
        body: {
          webhook_channel_id: webhookChannelId,
          ...options.body,
        },
      },
    );
  }

  /**
   * Post a typing indicator for the specified channel.
   *
   * > "If a bot is responding to a message and expects the computation to take a
   * few seconds, this endpoint may be called to let the user know that the
   * bot is processing their message."
   * >
   * > – Discord
   *
   * Fires a `TYPING_START` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId The channel to start typing in.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#trigger-typing-indicator
   */
  triggerTypingIndicator(channelId: string, options: RequestOptions = {}) {
    return this.post<Api.RESTPostAPIChannelTypingResult>(
      `/channels/${channelId}/typing`,
      options,
    );
  }

  /**
   * Returns all pinned messages in the channel as an array of message objects.
   *
   * @param channelId The channel to fetch pinned messages for.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#get-pinned-messages
   */
  getPinnedMessages(channelId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIChannelPinsResult>(
      `/channels/${channelId}/pins`,
      options,
    );
  }

  /**
   * Pin a message in a channel.
   *
   * - Requires the `MANAGE_MESSAGES` permission.
   * - The maximum amount of pinned messages is 50.
   * - This endpoint supports sending an Audit Log reason.
   *
   * Fires a `CHANNEL_PINS_UPDATE` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId The channel to add a pin to.
   * @param messageId The message to pin.
   * @param options Additional request options.
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#pin-message
   */
  pinMessage(
    channelId: string,
    messageId: string,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIChannelPinResult>(
      `/channels/${channelId}/pins/${messageId}`,
      options,
    );
  }

  /**
   * Unpin a message in a channel.
   *
   * - Requires the `MANAGE_MESSAGES` permission.
   *
   * Fires a `CHANNEL_PINS_UPDATE` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId
   * @param messageId
   * @param options Additional request options.
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#unpin-message
   */
  unpinMessage(
    channelId: string,
    messageId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIChannelPinResult>(
      `/channels/${channelId}/pins/${messageId}`,
      options,
    );
  }

  /**
   * Adds a recipient to a Group DM using their access token.
   *
   * @param channelId Group DM channel to add the user to.
   * @param userId User to add to the Group DM.
   * @param data Access token and nickname.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#group-dm-add-recipient
   */
  groupDMAddRecipient(
    channelId: string,
    userId: string,
    data: Api.RESTPutAPIChannelRecipientJSONBody,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIChannelRecipientResult>(
      `/channels/${channelId}/recipients/${userId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  addGroupDMRecipient = this.groupDMAddRecipient;

  /**
   * Removes a recipient from a Group DM.
   *
   * @param channelId Group DM channel to remove the user from.
   * @param userId User to remove.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#group-dm-remove-recipient
   */
  groupDMRemoveRecipient(
    channelId: string,
    userId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIChannelRecipientResult>(
      `/channels/${channelId}/recipients/${userId}`,
      options,
    );
  }

  removeGroupDMRecipient = this.groupDMRemoveRecipient;

  /**
   * Creates a new thread from an existing message.
   *
   * - When called on a `GUILD_TEXT` channel, creates a `PUBLIC_THREAD`.
   * - When called on a `GUILD_ANNOUNCEMENT` channel, creates a `ANNOUNCEMENT_THREAD`.
   * - Does not work on a `GUILD_FORUM` channel.
   * - The id of the created thread will be the same as the id of the source message,
   * and as such a message can only have a single thread created from it.
   *
   * Fires a `THREAD_CREATE` and a `MESSAGE_UPDATE` Gateway event.
   *
   * @returns A channel on success.
   * @throws A `400 BAD REQUEST` on invalid parameters.
   *
   * @param channelId Channel to act as a parent for the thread.
   * @param messageId Message to create the thread under.
   * @param data Thread & message body.
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#start-thread-from-message
   */
  startThreadFromMessage(
    channelId: string,
    messageId: string,
    data: Api.RESTPostAPIChannelMessagesThreadsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIChannelMessagesThreadsResult>(
      `/channels/${channelId}/messages/${messageId}/threads`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Creates a new thread that is not connected to an existing message.
   *
   * - This endpoint supports sending an Audit Log reason.
   * - Fires a `THREAD_CREATE` Gateway event.
   *
   * @returns A channel on success.
   * @throws A `400 BAD REQUEST` on invalid parameters.
   *
   * @param channelId Channel to act as a parent for the thread.
   * @param data The thread data to create.
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/channel#start-thread-without-message
   */
  startThreadWithoutMessage(
    channelId: string,
    data: Api.RESTPostAPIChannelThreadsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIChannelThreadsResult>(
      `/channels/${channelId}/threads`,
      {
        body: data,
        ...options,
      },
    );
  }

  startThread = this.startThreadWithoutMessage;

  /**
   * Creates a new thread in a forum channel, and sends a message within the
   * created thread.
   *
   * - The type of the created thread is `PUBLIC_THREAD`.
   * - See [message formatting](https://discord.com/developers/docs/reference#message-formatting)
   * for more information on how to properly format messages.
   * - The current user must have the `SEND_MESSAGES` permission
   * (`CREATE_PUBLIC_THREADS` is ignored).
   * - The maximum request size when sending a message is 25 MiB.
   * - For the embed object, you can set every field except `type` (it will be
   * rich regardless of if you try to set it), `provider`, `video`, and any
   * `height`, `width`, or `proxy_url` values for images.
   * - Note that when sending a message, you must provide a value for at least one of content, embeds, sticker_ids, components, or files[n].
   *
   * Fires a `THREAD_CREATE` and `MESSAGE_CREATE` Gateway event.
   *
   * @returns A channel, with a nested message object, on success.
   * @throws A `400 BAD REQUEST` on invalid parameters.
   *
   * @param channelId The forum channel to create the thread in.
   * @param data The forum message & tags to apply to the thread.
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   * @param [options.files] Files to add to the request. Make sure to add them to
   * `data.message.attachments`.
   *
   * @see https://discord.com/developers/docs/resources/channel#start-thread-in-forum-channel
   * @see https://discord.com/developers/docs/reference#message-formatting
   */
  startThreadInForumChannel(
    channelId: string,
    data: Api.RESTPostAPIGuildForumThreadsJSONBody,
    options: { reason?: string; files?: File[] } = {},
  ) {
    return this.post<Api.RESTPostAPIGuildForumThreadsJSONBody>(
      `/channels/${channelId}/threads`,
      {
        body: data,
        files: options.files,
        ...options,
      },
    );
  }

  /**
   * Adds the current user to a thread. Requires the thread is not archived.
   *
   * Fires a `THREAD_MEMBERS_UPDATE` and a `THREAD_CREATE` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId Thread channel to join.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#join-thread
   */
  joinThread(channelId: string, options: RequestOptions = {}) {
    return this.addThreadMember(channelId, '@me', options);
  }

  /**
   * Adds another member to a thread.
   *
   * - Requires the ability to send messages in the thread.
   * - Also requires the thread is not archived.
   * - Only the thread owner can add members to a `PRIVATE_THREAD` channel.
   *
   * Fires a `THREAD_MEMBERS_UPDATE` Gateway event.
   *
   * @returns A 204 empty response if the member is successfully added or was
   * already a member of the thread.
   *
   * @param channelId Thread channel to add the member to.
   * @param userId User to add to the thread.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#add-thread-member
   */
  addThreadMember(
    channelId: string,
    userId: string,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIChannelThreadMembersResult>(
      `/channels/${channelId}/thread-members/${userId}`,
      options,
    );
  }

  /**
   * Removes the current user from a thread. Requires the thread is not archived.
   *
   * Fires a `THREAD_MEMBERS_UPDATE` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId Thread channel to leave.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#leave-thread
   */
  leaveThread(channelId: string, options: RequestOptions = {}) {
    return this.removeThreadMember(channelId, '@me', options);
  }

  /**
   * Removes another member from a thread.
   *
   * - Requires the `MANAGE_THREADS permission`, or to be the creator of the thread
   * if it is a `PRIVATE_THREAD`.
   * - Also requires the thread is not archived.
   *
   * Fires a `THREAD_MEMBERS_UPDATE` Gateway event.
   *
   * @returns A 204 empty response on success.
   *
   * @param channelId Thread channel to remove the member from.
   * @param userId Member to remove.
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/channel#remove-thread-member
   */
  removeThreadMember(
    channelId: string,
    userId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIChannelThreadMembersResult>(
      `/channels/${channelId}/thread-members/${userId}`,
      options,
    );
  }

  /**
   * @returns A thread member object for the specified user if they are a member of the thread
   * @throws A 404 response otherwise.
   *
   * @param channelId Thread channel to fetch member for
   * @param userId Member to fetch
   * @param options Additional options for the request
   * @param [options.with_member] Whether to include a
   * {@link import('discord-api-types/v10').APIGuildMember|guild member} object
   * for the user.
   *
   * @see https://discord.com/developers/docs/resources/channel#get-thread-member
   */
  getThreadMember(
    channelId: string,
    userId: string,
    options: { with_member?: boolean } = {},
  ) {
    return this.get<Api.RESTGetAPIChannelThreadMembersResult>(
      `/channels/${channelId}/thread-members/${userId}`,
      {
        query: options,
      },
    );
  }

  /**
   * Returns array of {@link import('discord-api-types/v10').APIThreadMember|thread member objects}
   * that are members of the thread.
   *
   * - This endpoint is restricted according to whether the `GUILD_MEMBERS`
   * [Privileged Intent](https://discord.com/developers/docs/topics/gateway#privileged-intents) is enabled for your application.
   *
   * @param channelId Thread channel to fetch members for
   * @param options Additional options for the request
   * @param {boolean} [options.with_member] Whether to include guild member objects for each
   * member.
   * [Paginated results](https://discord.com/developers/docs/change-log#thread-member-details-and-pagination)
   * can be enabled by setting this value to `true`.
   * @param {string} [options.after] Get thread members after this user ID
   * @param {number} [options.limit=100] Max number of thread members to return (1-100).
   *
   * @see https://discord.com/developers/docs/resources/channel#list-thread-members
   */
  listThreadMembers(
    channelId: string,
    options: Api.RESTGetAPIChannelThreadMembersQuery = {},
  ) {
    return this.get<Api.RESTGetAPIChannelThreadMembersResult>(
      `/channels/${channelId}/thread-members`,
      {
        query: options,
      },
    );
  }

  /**
   * Returns archived threads in the channel that are public.
   *
   * - When called on a `GUILD_TEXT` channel, returns threads of type `PUBLIC_THREAD`.
   * - When called on a `GUILD_ANNOUNCEMENT` channel returns threads of type
   * `ANNOUNCEMENT_THREAD`.
   * - Threads are ordered by `archive_timestamp`, in descending order.
   * - Requires the `READ_MESSAGE_HISTORY` permission.
   *
   * @param channelId Parent channel to list threads for
   * @param options Additional options for the request
   * @param {string} [options.before] returns threads archived before this ISO8601 timestamp
   * @param {number} [options.limit] optional maximum number of threads to return
   *
   * @see https://discord.com/developers/docs/resources/channel#list-public-archived-threads
   */
  listPublicArchivedThreads(
    channelId: string,
    options?: Api.RESTGetAPIChannelThreadsArchivedQuery,
  ) {
    return this.get<Api.RESTGetAPIChannelThreadsArchivedPublicResult>(
      `/channels/${channelId}/threads/archived/public`,
      {
        query: options,
      },
    );
  }

  /**
   * Returns archived threads in the channel that are of type `PRIVATE_THREAD`.
   *
   * - Threads are ordered by `archive_timestamp`, in descending order.
   * - Requires both the `READ_MESSAGE_HISTORY` and `MANAGE_THREADS` permissions.
   *
   * @param channelId Parent channel to list threads for
   * @param options Additional options for the request
   * @param {string} [options.after] returns threads archived before this ISO8601 timestamp
   * @param {number} [options.limit] optional maximum number of threads to return
   *
   * @see https://discord.com/developers/docs/resources/channel#list-private-archived-threads
   */
  listPrivateArchivedThreads(
    channelId: string,
    options?: Api.RESTGetAPIChannelThreadsArchivedQuery,
  ) {
    return this.get<Api.APIThreadList>(
      `/channels/${channelId}/threads/archived/private`,
      {
        query: options,
      },
    );
  }

  /**
   * Returns archived threads in the channel that are of type `PRIVATE_THREAD`,
   * and the user has joined.
   *
   * - Threads are ordered by their id, in descending order.
   * - Requires the `READ_MESSAGE_HISTORY` permission.
   *
   * @param channelId Parent channel to list threads for
   * @param options Additional options for the request
   * @param {string} [options.after] returns threads archived before this ISO8601 timestamp
   * @param {number} [options.limit] optional maximum number of threads to return
   *
   * @see https://discord.com/developers/docs/resources/channel#list-joined-private-archived-threads
   */
  listJoinedPrivateArchivedThreads(
    channelId: string,
    options?: Api.RESTGetAPIChannelThreadsArchivedQuery,
  ) {
    return this.get<Api.RESTGetAPIChannelUsersThreadsArchivedResult>(
      `/channels/${channelId}/users/@me/threads/archived/private`,
      {
        query: options,
      },
    );
  }

  //#endregion

  //#region Emoji

  /**
   * Returns a list of emoji objects for the given guild.
   *
   * @param guildId Guild ID to list emojis for
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/emoji#list-guild-emojis
   */
  listGuildEmojis(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildEmojisResult>(
      `/guilds/${guildId}/emojis`,
      options,
    );
  }

  /**
   * Returns an emoji object for the given guild and emoji ID.
   *
   * @param guildId Guild ID to fetch emoji for
   * @param emojiId Emoji ID to fetch
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/emoji#get-guild-emoji
   */
  getGuildEmoji(
    guildId: string,
    emojiId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIGuildEmojiResult>(
      `/guilds/${guildId}/emojis/${emojiId}`,
      options,
    );
  }

  /**
   * Create a new emoji for the guild.
   *
   * - Requires the `MANAGE_GUILD_EXPRESSIONS` permission.
   *
   * Fires a `GUILD_EMOJIS_UPDATE` Gateway event.
   *
   * @returns The new emoji object on success.
   *
   * @param guildId Guild ID to create emoji for
   * @param data Emoji data
   * @param data.name name of the emoji
   * @param data.imageData the 128x128 emoji image
   * @param data.roles array of role IDs allowed to use this emoji
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/emoji#create-guild-emoji
   */
  createGuildEmoji(
    guildId: string,
    data: {
      name: string;
      imageData: File;
      roles?: string[];
    },
    options: RequestOptions = {},
  ) {
    if (!data) throw new TypeError('Emoji data is required.');

    return this.post<Api.RESTPostAPIGuildEmojiResult>(
      `/guilds/${guildId}/emojis`,
      {
        body: {
          name: data.name,
          image: createDataURI(data.imageData),
          roles: data.roles,
        },
        ...options,
      },
    );
  }

  /**
   * Modify the given emoji.
   *
   * - Requires the `MANAGE_GUILD_EXPRESSIONS` permission.
   * - All parameters to this endpoint are optional.
   * - This endpoint supports sending an Audit Log reason.
   *
   * Fires a `GUILD_EMOJIS_UPDATE` Gateway event.
   *
   * @returns The updated emoji object on success.
   *
   * @param guildId Guild ID to modify emoji for
   * @param emojiId Emoji ID to modify
   * @param data New emoji data
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/emoji#modify-guild-emoji
   */
  modifyGuildEmoji(
    guildId: string,
    emojiId: string,
    data: Api.RESTPatchAPIGuildEmojiJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildEmojiResult>(
      `/guilds/${guildId}/emojis/${emojiId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Delete the given emoji.
   *
   * - Requires the `MANAGE_GUILD_EXPRESSIONS` permission.
   * - This endpoint supports sending an Audit Log reason.
   *
   * Fires a `GUILD_EMOJIS_UPDATE` Gateway event.
   *
   * @returns A 204 response on success
   *
   * @param guildId Guild ID to delete emoji for
   * @param emojiId Emoji ID to delete
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see Fires a Guild Emojis Update Gateway event.
   */
  deleteGuildEmoji(
    guildId: string,
    emojiId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildEmojiResult>(
      `/guilds/${guildId}/emojis/${emojiId}`,
      options,
    );
  }

  //#endregion

  //#region Guild

  /**
   * Create a new guild. This endpoint can be used only by bots in less than 10
   * guilds.
   *
   * Fires a `GUILD_CREATE` Gateway event.
   *
   * @returns a guild object on success.
   * @param data New guild data
   * @param options
   *
   * @example Partial Channel Object
   * {
   *   name: "naming-things-is-hard",
   *   type: 0
   * }
   * @example Category Channel
   * {
   *   "name": "my-category",
   *   "type": 4,
   *   "id": 1
   * }
   * {
   *   "name": "naming-things-is-hard",
   *   "type": 0,
   *   "id": 2,
   *   "parent_id": 1
   * }
   * @see https://discord.com/developers/docs/resources/guild#create-guild
   * */
  createGuild(
    data: Api.RESTPostAPIGuildsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIGuildsResult>(`/guilds`, {
      body: data,

      ...options,
    });
  }

  /**
   * Returns the {@link import('discord-api-types/v10').APIGuild|guild} object
   * for the given id.
   *
   * If {@link options.with_counts|`with_counts`} is set to `true`, this endpoint
   * will also return `approximate_member_count` and `approximate_presence_count`
   * for the guild.
   *
   * @param guildId Guild id to query
   * @param options Additional options for the request
   * @param {boolean} [options.with_counts] when `true`, will return approximate
   * member and presence counts for the guild
   *
   * @see https://discord.com/developers/docs/resources/guild#get-guild
   */
  getGuild(guildId: string, options: { with_counts?: boolean } = {}) {
    return this.get<Api.RESTGetAPIGuildResult>(`/guilds/${guildId}`, {
      query: options,
    });
  }

  /**
   * Returns the {@link import('discord-api-types/v10').APIGuildPreview|guild preview}
   * for the given id.
   *
   * If the user is not in the guild, then the guild must be
   * {@link import('discord-api-types/v10').GuildFeature.Discoverable|discoverable}.
   *
   * @param guildId Guild id to query
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/guild#get-guild-preview
   */
  getGuildPreview(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildPreviewResult>(
      `/guilds/${guildId}/preview`,
      options,
    );
  }

  /**
   * Modify a guild's settings.
   *
   * - Requires the `MANAGE_GUILD` permission.
   * - Attempting to add or remove the
   * {@link import('discord-api-types/v10').GuildFeature.Community|`COMMUNITY`}
   * guild feature requires the `ADMINISTRATOR` permission.
   * - All parameters to this endpoint are optional
   * - This endpoint supports sending an Audit Log reason.
   *
   * Fires a `GUILD_UPDATE` Gateway event.
   *
   * @returns The updated guild object on success.
   *
   * @param guildId Guild ID to modify
   * @param data New settings
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/guild#modify-guild
   */
  modifyGuild(
    guildId: string,
    data: Api.RESTPatchAPIGuildJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildResult>(`/guilds/${guildId}`, {
      body: data,
      ...options,
    });
  }

  editGuild = this.modifyGuild;

  /**
   * Delete a guild permanently. User must be owner.
   *
   * Fires a `GUILD_DELETE` Gateway event.
   *
   * @returns 204 No Content on success.
   *
   * @param guildId Guild ID to delete
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/guild#delete-guild
   */
  deleteGuild(guildId: string, options: RequestOptions = {}) {
    return this.delete<Api.RESTDeleteAPIGuildResult>(
      `/guilds/${guildId}`,
      options,
    );
  }

  /**
   * Returns a list of guild channel objects. Does not include threads.
   *
   * @param guildId Guild ID to list channels for
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/guild#get-guild-channels
   */
  getGuildChannels(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildChannelsResult>(
      `/guilds/${guildId}/channels`,
      options,
    );
  }

  /**
   * Create a new channel object for the guild.
   *
   * - Requires the MANAGE_CHANNELS permission.
   * - If setting permission overwrites, only permissions your bot has in the
   * guild can be allowed/denied.
   * - Setting `MANAGE_ROLES` permission in channels is only possible for
   * guild administrators.
   *
   * Fires a `CHANNEL_CREATE` Gateway event.
   *
   * @returns The new channel object on success.
   *
   * @param guildId Guild ID to create channel in
   * @param data New channel data
   * @param options Additional options for the request
   * @param [options.reason] Reason to display in the guild's {@link REST.getGuildAuditLog audit log}
   *
   * @see https://discord.com/developers/docs/resources/guild#create-guild-channel
   */
  createGuildChannel(
    guildId: string,
    data: Api.RESTPostAPIGuildChannelJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIGuildChannelResult>(
      `/guilds/${guildId}/channels`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Modify the positions of a set of channel objects for the guild.
   *
   * - Requires `MANAGE_CHANNELS` permission.
   * - Only channels to be modified are required.
   *
   * Fires multiple `CHANNEL_UPDATE` Gateway events.
   *
   * @returns a 204 empty response on success.
   *
   * @param guildId Guild ID to modify
   * @param data New channel positions
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions
   */
  modifyGuildChannelPositions(
    guildId: string,
    data: Api.RESTPatchAPIGuildChannelPositionsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildChannelPositionsResult>(
      `/guilds/${guildId}/channels`,
      {
        body: data,
        ...options,
      },
    );
  }

  /**
   * Returns a guild member object for the specified user.
   *
   * @param guildId Guild ID to fetch member for
   * @param userId User ID to fetch
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/guild#get-guild-member
   */
  getGuildMember(
    guildId: string,
    userId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIGuildMemberResult>(
      `/guilds/${guildId}/members/${userId}`,
      options,
    );
  }

  /**
   * Returns a list of guild member objects that are members of the guild.
   *
   * - This endpoint is restricted according to whether the GUILD_MEMBERS Privileged Intent is enabled for your application.
   * - All parameters to this endpoint are optional
   *
   * @param guildId Guild ID to list members for
   * @param options Additional options for the request
   * @param [options.limit=1] max number of members to return (1-1000)
   * @param [options.after=0] the highest user id in the previous page
   *
   * @see https://discord.com/developers/docs/resources/guild#list-guild-members
   */
  listGuildMembers(
    guildId: string,
    options: Api.RESTGetAPIGuildMembersQuery &
      RequestOptions<never, Api.RESTGetAPIGuildMembersQuery> = {},
  ) {
    const { after, limit, ...params } = options;

    return this.get<Api.RESTGetAPIGuildMembersResult>(
      `/guilds/${guildId}/members`,
      {
        query: { after, limit, ...params.query },
        ...params,
      },
    );
  }

  /**
   * Returns a list of guild member objects whose username or nickname starts with a provided string.
   *
   * @param guildId Guild ID to list members for
   * @param query Query string to match username(s) and nickname(s) against.
   * @param [limit=1] max number of members to return
   *
   * @see https://discord.com/developers/docs/resources/guild#list-guild-members
   */
  searchGuildMembers(
    guildId: string,
    query: string,
    options: RequestOptions & { limit?: number } = {},
  ) {
    return this.get<Api.RESTGetAPIGuildMembersResult>(
      `/guilds/${guildId}/members/search`,
      {
        query: {
          query,
          limit: options.limit,
          ...options.query,
        },
        ...options,
      },
    );
  }

  /**
   * Adds a user to the guild, provided you have a valid oauth2 access token
   * for the user with the guilds.join scope.
   *
   * - The authentication token must be a Bot token (belonging to the same
   * application used for authorization), and the bot must be a member of the
   * guild with `CREATE_INSTANT_INVITE` permission.
   *
   * For guilds with Membership Screening enabled:
   * - This endpoint will default
   * to adding new members as pending in the guild member object. Members that
   * are pending will have to complete membership screening before they become
   * full members that can talk.
   * - Assigning a role using the `roles` parameter will add the user to the guild
   * as a full member (pending s false in the member object). A member with a role
   * will bypass membership screening and the guild's verification level, and get
   * immediate access to chat. Therefore, instead of assigning a role when the member
   * joins, it is recommended to grant roles only after the user completes screening.
   *
   * Fires a `GUILD_MEMBER_ADD` Gateway event.
   *
   * @returns The guild member, or 204 No Content if the user is already a member
   * of the guild.
   *
   * @param guildId Guild ID to add user to
   * @param userId User ID to add
   * @param accessToken OAuth2 access token
   * @param data Additional data
   * @param options
   *
   * @see https://discord.com/developers/docs/resources/guild#add-guild-member
   */
  addGuildMember(
    guildId: string,
    userId: string,
    accessToken: string,
    data?: Omit<Api.RESTPutAPIGuildMemberJSONBody, 'access_token'>,
    options: BotRequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIGuildMemberResult>(
      `/guilds/${guildId}/members/${userId}`,
      {
        body: {
          access_token: accessToken,
          ...data,
        },
        ...options,
      },
    );
  }

  /**
   * Modify attributes of a guild member.
   *
   * - If the `channel_id` is set to null, this will force the target user to
   * be disconnected from voice
   *
   * Fires a `GUILD_MEMBER_UPDATE` Gateway event.
   *
   * @returns The guild member.
   *
   * @param guildId Guild ID
   * @param userId User ID to update
   * @param data Member data
   * @param options Additional options
   * // TODO
   *
   * @see https://discord.com/developers/docs/resources/guild#modify-guild-member
   */
  modifyGuildMember(
    guildId: string,
    userId: string,
    data: Api.RESTPatchAPIGuildMemberJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildMemberResult>(
      `/guilds/${guildId}/members/${userId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  editCurrentMember(
    guildId: string,
    nickname?: string,
    options: RequestOptions = {},
  ) {
    return this.editGuildMember(
      guildId,
      '@me',
      {
        nick: nickname,
      },
      options,
    );
  }

  /**
   * @deprecated Deprecated in favour of {@link REST.editCurrentMember}
   */
  editCurrentUserNick(
    guildId: string,
    nickname?: string,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.APIGuildMember>(
      `/guilds/${guildId}/members/@me/nick`,
      {
        body: {
          nick: nickname,
        },
        ...options,
      },
    );
  }

  addGuildMemberRole(
    guildId: string,
    userId: string,
    roleId: string,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIGuildMemberRoleResult>(
      `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      options,
    );
  }

  removeGuildMemberRole(
    guildId: string,
    userId: string,
    roleId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildMemberRoleResult>(
      `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      options,
    );
  }

  removeGuildMember(
    guildId: string,
    userId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildMemberResult>(
      `/guilds/${guildId}/members/${userId}`,
      options,
    );
  }

  getGuildBans(guildId: string, options?: Api.RESTGetAPIGuildBansQuery) {
    return this.get<Api.RESTGetAPIGuildBansResult>(`/guilds/${guildId}/bans`, {
      query: options,
    });
  }

  getGuildBan(guildId: string, userId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildBanResult>(
      `/guilds/${guildId}/bans/${userId}`,
      options,
    );
  }

  createGuildBan(
    guildId: string,
    userId: string,
    data: Api.RESTPutAPIGuildBanJSONBody,
    options: RequestOptions = {},
  ) {
    return this.put<Api.RESTPutAPIGuildBanResult>(
      `/guilds/${guildId}/bans/${userId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  removeGuildBan(
    guildId: string,
    userId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildBanResult>(
      `/guilds/${guildId}/bans/${userId}`,
      options,
    );
  }

  getGuildRoles(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildRolesResult>(
      `/guilds/${guildId}/roles`,
      options,
    );
  }

  createGuildRole(
    guildId: string,
    data: Api.RESTPostAPIGuildRoleJSONBody & {
      icon: Omit<File, 'filename' | 'key'> | string;
    },
    options: RequestOptions = {},
  ) {
    if (data.icon && typeof data.icon !== 'string')
      data.icon = createDataURI(data.icon);

    return this.post<Api.RESTPostAPIGuildRoleResult>(
      `/guilds/${guildId}/roles`,
      {
        body: data,
        ...options,
      },
    );
  }

  editGuildRolePositions(
    guildId: string,
    data: Api.RESTPatchAPIGuildRolePositionsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildRolePositionsResult>(
      `/guilds/${guildId}/roles`,
      {
        body: data,
        ...options,
      },
    );
  }

  editGuildRole(
    guildId: string,
    roleId: string,
    data: Api.RESTPatchAPIGuildRoleJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildRoleResult>(
      `/guilds/${guildId}/roles/${roleId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  deleteGuildRole(
    guildId: string,
    roleId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildRoleResult>(
      `/guilds/${guildId}/roles/${roleId}`,
      options,
    );
  }

  getGuildPruneCount(
    guildId: string,
    options?: Api.RESTGetAPIGuildPruneCountQuery,
  ) {
    return this.get<Api.RESTGetAPIGuildPruneCountResult>(
      `/guilds/${guildId}/prune`,
      {
        query: options,
      },
    );
  }

  startGuildPrune(
    guildId: string,
    data?: Api.RESTPostAPIGuildPruneJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIGuildPruneResult>(
      `/guilds/${guildId}/prune`,
      {
        body: options,
        ...options,
      },
    );
  }

  getGuildVoiceRegions(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildVoiceRegionsResult>(
      `/guilds/${guildId}/regions`,
      options,
    );
  }

  getGuildInvites(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildInvitesResult>(
      `/guilds/${guildId}/invites`,
      options,
    );
  }

  getGuildIntegrations(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildIntegrationsResult>(
      `/guilds/${guildId}/integrations`,
      options,
    );
  }

  deleteGuildIntegration(
    guildId: string,
    integrationId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildIntegrationResult>(
      `/guilds/${guildId}/integrations/${integrationId}`,
      options,
    );
  }

  getGuildWidgetSettings(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildWidgetSettingsResult>(
      `/guilds/${guildId}/widget`,
      options,
    );
  }

  editGuildWidgetSettings(
    guildId: string,
    data: Api.RESTPatchAPIGuildWidgetSettingsJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildWidgetSettingsResult>(
      `/guilds/${guildId}/widget`,
      {
        body: data,
        ...options,
      },
    );
  }

  getGuildWidgetData(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildWidgetJSONResult>(
      `/guilds/${guildId}/widget.json`,
      options,
    );
  }

  getGuildVanity(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildVanityUrlResult>(
      `/guilds/${guildId}/vanity-url`,
      options,
    );
  }

  getGuildWidgetImage(guildId: string, style: Api.GuildWidgetStyle) {
    return this.get<Buffer>(`/guilds/${guildId}/widget.png`, {
      query: {
        style,
      },
    });
  }

  getGuildWelcomeScreen(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildWelcomeScreenResult>(
      `/guilds/${guildId}/welcome-screen`,
      options,
    );
  }

  editGuildWelcomeScreen(
    guildId: string,
    data: Api.RESTPatchAPIGuildWelcomeScreenJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTGetAPIGuildWelcomeScreenResult>(
      `/guilds/${guildId}/welcome-screen`,
      {
        body: data,
        ...options,
      },
    );
  }

  editUserVoiceState(
    guildId: string,
    userId: string,
    data: Api.RESTPatchAPIGuildVoiceStateUserJSONBody & {
      request_to_speak_timestamp?: string;
    },
    options: RequestOptions = {},
  ) {
    return this.patch<never>(`/guilds/${guildId}/voice-states/${userId}`, {
      body: data,
      ...options,
    });
  }

  editCurrentUserVoiceState(
    guildId: string,
    data: Api.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
    options: RequestOptions = {},
  ) {
    return this.editUserVoiceState(
      guildId,
      '@me',
      data as Api.RESTPatchAPIGuildVoiceStateUserJSONBody,
      options,
    );
  }

  //#endregion

  //#region Scheduled Events

  listGuildScheduledEvents(guildId: string, withUserCount = false) {
    return this.get<Api.RESTGetAPIGuildScheduledEventsResult>(
      `/guilds/${guildId}/scheduled-events`,
      {
        query: {
          with_user_count: withUserCount,
        },
      },
    );
  }

  createGuildScheduledEvent(
    guildId: string,
    data: Omit<Api.RESTPostAPIGuildScheduledEventJSONBody, 'image'>,
    options: { image?: File; reason?: string } & RequestOptions = {},
  ) {
    const { image, ...params } = options;

    return this.post<Api.RESTPostAPIGuildScheduledEventResult>(
      `/guilds/${guildId}/scheduled-events`,
      {
        body: {
          image: image ? createDataURI(image) : undefined,
          ...data,
        },
        ...options,
        ...params,
      },
    );
  }

  getGuildScheduledEvent(
    guildId: string,
    scheduledEventId: string,
    withUserCount = false,
  ) {
    return this.get<Api.RESTGetAPIGuildScheduledEventResult>(
      `/guilds/${guildId}/scheduled-events/${scheduledEventId}`,
      {
        query: {
          with_user_count: withUserCount,
        },
      },
    );
  }

  editGuildScheduledEvent(
    guildId: string,
    scheduledEventId: string,
    data: Omit<Api.RESTPatchAPIGuildScheduledEventJSONBody, 'image'>,
    options: { image?: File; reason?: string } & RequestOptions = {},
  ) {
    const { image, ...params } = options;

    return this.patch<Api.RESTPatchAPIGuildScheduledEventResult>(
      `/guilds/${guildId}/scheduled-events/${scheduledEventId}`,
      {
        body: {
          image: image ? createDataURI(image) : undefined,
          ...data,
        },
        ...options,
        ...params,
      },
    );
  }

  deleteGuildScheduledEvent(
    guildId: string,
    scheduledEventId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildScheduledEventResult>(
      `/guilds/${guildId}/scheduled-events/${scheduledEventId}`,
      options,
    );
  }

  getGuildScheduledEventUsers(
    guildId: string,
    scheduledEventId: string,
    options: Api.RESTGetAPIGuildScheduledEventUsersQuery,
  ) {
    return this.get<Api.RESTGetAPIGuildScheduledEventUsersResult>(
      `/guilds/${guildId}/scheduled-events/${scheduledEventId}/users`,
      {
        query: options,
      },
    );
  }

  //#endregion

  //#region Templates

  getGuildTemplate(code: string, options: RequestOptions = {}) {
    return this.get<Api.APITemplate>(`/guilds/templates/${code}`, options);
  }

  createGuildFromTemplate(code: string, data: { name: string; icon: File }) {
    return this.post<Api.APIGuild>(`/guilds/templates/${code}`, {
      body: {
        ...data,
        icon: createDataURI(data.icon),
      },
    });
  }

  getGuildTemplates(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildTemplatesResult>(
      `/guilds/${guildId}/templates`,
      options,
    );
  }

  createGuildTemplate(
    guildId: string,
    data: Api.RESTPostAPIGuildTemplatesJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIGuildTemplatesResult>(
      `/guilds/${guildId}/templates`,
      {
        body: data,
        ...options,
      },
    );
  }

  syncGuildTemplate(
    guildId: string,
    code: string,
    options: RequestOptions = {},
  ) {
    return this.put<Api.APITemplate>(
      `/guilds/${guildId}/templates/${code}`,
      options,
    );
  }

  editGuildTemplate(
    guildId: string,
    code: string,
    data: Api.RESTPatchAPIGuildTemplateJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildTemplateResult>(
      `/guilds/${guildId}/templates/${code}`,
      {
        body: data,
        ...options,
      },
    );
  }

  deleteGuildTemplate(
    guildId: string,
    code: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.APITemplate>(
      `/guilds/${guildId}/templates/${code}`,
      options,
    );
  }

  //#endregion

  //#region Invites

  getInvite(code: string, options: Api.RESTGetAPIInviteQuery = {}) {
    return this.get<Api.RESTGetAPIInviteResult>(`/invites/${code}`, {
      query: options,
      useAuth: false,
    });
  }

  deleteInvite(code: string, options: RequestOptions = {}) {
    return this.delete<Api.RESTDeleteAPIInviteResult>(
      `/invites/${code}`,
      options,
    );
  }

  //#endregion

  //#region Stage Instances

  createStageInstance(
    channelId: string,
    data: Omit<Api.RESTPostAPIStageInstanceJSONBody, 'channel_id'>,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIStageInstanceResult>(`/stage-instances`, {
      body: {
        channel_id: channelId,
        ...data,
      },
      ...options,
    });
  }

  getStageInstance(channelId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIStageInstanceResult>(
      `/stage-instances/${channelId}`,
      options,
    );
  }

  editStageInstance(
    channelId: string,
    data: Api.RESTPatchAPIStageInstanceJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIStageInstanceResult>(
      `/stage-instances/${channelId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  deleteStageInstance(channelId: string, options: RequestOptions = {}) {
    return this.delete<Api.RESTDeleteAPIStageInstanceResult>(
      `/stage-instances/${channelId}`,
      options,
    );
  }

  //#endregion

  //#region Stickers

  getSticker(stickerId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIStickerResult>(
      `/stickers/${stickerId}`,
      options,
    );
  }

  listPremiumStickerPacks(options: RequestOptions = {}) {
    return this.get<Api.RESTGetNitroStickerPacksResult>(
      `/sticker-packs`,
      options,
    );
  }

  listGuildStickers(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGuildStickersResult>(
      `/guilds/${guildId}/stickers`,
      options,
    );
  }

  getGuildSticker(
    guildId: string,
    stickerId: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIGuildStickerResult>(
      `/guilds/${guildId}/stickers/${stickerId}`,
      options,
    );
  }

  createGuildSticker(
    guildId: string,
    data: Omit<Api.RESTPostAPIGuildStickerFormDataBody, 'file'>,
    image: File,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIGuildStickerResult>(
      `/guilds/${guildId}/stickers`,
      {
        body: data,
        files: [
          {
            key: 'file',
            ...image,
          },
        ],
        ...options,
      },
    );
  }

  editGuildSticker(
    guildId: string,
    stickerId: string,
    data: Api.RESTPatchAPIGuildStickerJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIGuildStickerResult>(
      `/guilds/${guildId}/stickers/${stickerId}`,
      {
        body: data,
        ...options,
      },
    );
  }

  deleteGuildSticker(
    guildId: string,
    stickerId: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIGuildStickerResult>(
      `/guilds/${guildId}/stickers/${stickerId}`,
      options,
    );
  }

  //#endregion

  //#region Users

  getCurrentUser(options: RequestOptions = {}) {
    return this.getUser(
      '@me',
      options,
    ) as Promise<Api.RESTGetAPICurrentUserResult>;
  }

  getUser(userId: string, options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIUserResult>(`/users/${userId}`, options);
  }

  editCurrentUser(
    data: Api.RESTPatchAPICurrentUserJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPICurrentUserResult>(`/users/@me`, {
      body: data,

      ...options,
    });
  }

  getCurrentUserGuilds(options: Api.RESTGetAPICurrentUserGuildsQuery = {}) {
    return this.get<Api.RESTGetAPICurrentUserGuildsResult>(
      `/users/@me/guilds`,
      {
        query: options,
      },
    );
  }

  getCurrentGuildMember(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.APIGuildMember>(
      `/users/@me/guilds/${guildId}/member`,
      options,
    );
  }

  leaveGuild(guildId: string, options: RequestOptions = {}) {
    return this.delete<Api.RESTDeleteAPICurrentUserGuildResult>(
      `/users/@me/guilds/${guildId}`,
      options,
    );
  }

  createDM(recipientId: string, options: RequestOptions = {}) {
    return this.post<Api.APIChannel>(`/users/@me/channels`, {
      body: {
        recipient_id: recipientId,
      },
      ...options,
    });
  }

  createGroupDM(accessTokens: string[], nicks?: Record<string, string>) {
    return this.post<Api.APIChannel>(`/users/@me/channels`, {
      body: {
        access_tokens: accessTokens,
        nicks,
      },
    });
  }

  getUserConnections(userId: string, options: RequestOptions = {}) {
    return this.get<Api.APIConnection>(`/users/${userId}/connections`, options);
  }

  //#endregion

  //#region Voice

  listVoiceRegions(options: RequestOptions = {}) {
    return this.get<Api.APIVoiceRegion[]>(`/voice/regions`, options);
  }

  //#endregion

  //#region Webhooks

  createWebhook(
    channelId: string,
    data: Api.RESTPostAPIChannelWebhookJSONBody,
    options: RequestOptions = {},
  ) {
    return this.post<Api.RESTPostAPIChannelWebhookResult>(
      `/channels/${channelId}/webhooks`,
      {
        body: data,
        ...options,
      },
    );
  }

  getChannelWebhooks(channelId: string, options: RequestOptions = {}) {
    return this.get<Api.APIWebhook[]>(
      `/channels/${channelId}/webhooks`,
      options,
    );
  }

  getGuildWebhooks(guildId: string, options: RequestOptions = {}) {
    return this.get<Api.APIWebhook[]>(`/guilds/${guildId}/webhooks`, options);
  }

  getWebhook(webhookId: string, options: RequestOptions = {}) {
    return this.get<Api.APIWebhook>(`/webhooks/${webhookId}`, options);
  }

  getWebhookWithToken(
    webhookId: string,
    token: string,
    options: RequestOptions = {},
  ) {
    return this.get<Api.APIWebhook>(`/webhooks/${webhookId}/${token}`, {
      useAuth: false,
      ...options,
    });
  }

  editWebhook(
    webhookId: string,
    data: Api.RESTPatchAPIWebhookJSONBody,
    options: RequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIWebhookResult>(`/webhooks/${webhookId}`, {
      body: data,
      ...options,
    });
  }

  editWebhookWithToken(
    webhookId: string,
    token: string,
    data: Omit<Api.RESTPatchAPIWebhookJSONBody, 'channel_id'>,
    options: RequestOptions = {},
  ) {
    return this.patch<Omit<Api.RESTPatchAPIWebhookResult, 'user'>>(
      `/webhooks/${webhookId}/${token}`,
      {
        body: data,
        useAuth: false,
        ...options,
      },
    );
  }

  deleteWebhook(webhookId: string, options: RequestOptions = {}) {
    return this.delete<Api.RESTDeleteAPIWebhookResult>(
      `/webhooks/${webhookId}`,
      options,
    );
  }

  deleteWebhookWithToken(
    webhookId: string,
    token: string,
    options: RequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIWebhookResult>(
      `/webhooks/${webhookId}/${token}`,
      {
        useAuth: false,
        ...options,
      },
    );
  }

  executeWebhook<T = Api.RESTPostAPIWebhookWithTokenJSONBody>(
    webhookId: string,
    token: string,
    data: T,
    options: WebhookRequestOptions<T, Api.RESTPostAPIWebhookWithTokenQuery> & {
      compat?: string;
    } = {},
    compat = '',
  ) {
    return this.post<null | Api.RESTPostAPIWebhookWithTokenWaitResult>(
      `/webhooks/${webhookId}/${token}${compat ?? ''}`,
      {
        body: data,
        useAuth: false,
        ...options,
      },
    );
  }

  createWebhookMessage(
    webhookId: string,
    token: string,
    data: Api.RESTPostAPIWebhookWithTokenJSONBody,
    options: RequestOptions<
      Api.RESTPostAPIWebhookWithTokenJSONBody,
      Api.RESTPostAPIWebhookWithTokenQuery
    > = {},
  ) {
    return this.executeWebhook<Api.RESTPostAPIWebhookWithTokenJSONBody>(
      webhookId,
      token,
      data,
      options,
    );
  }

  executeWebhookSlack(
    webhookId: string,
    token: string,
    data: any,
    options: RequestOptions<
      any,
      Api.RESTPostAPIWebhookWithTokenSlackQuery
    > = {},
  ) {
    return this.executeWebhook<any>(webhookId, token, data, options, '/slack');
  }

  executeWebhookGitHub(
    webhookId: string,
    token: string,
    data: any,
    options: RequestOptions<
      any,
      Api.RESTPostAPIWebhookWithTokenGitHubQuery
    > = {},
  ) {
    return this.executeWebhook<any>(webhookId, token, data, options, '/github');
  }

  getWebhookMessage(
    webhookId: string,
    token: string,
    messageId: string,
    options: WebhookRequestOptions = {},
  ) {
    return this.get<Api.RESTGetAPIWebhookWithTokenMessageResult>(
      `/webhooks/${webhookId}/${token}/messages/${messageId}`,
      {
        ...options,
        query: {
          thread_id: options.threadId,
        },
        useAuth: false,
      },
    );
  }

  editWebhookMessage(
    webhookId: string,
    token: string,
    messageId: string,
    data: Api.RESTPatchAPIWebhookWithTokenMessageJSONBody,
    options: WebhookRequestOptions = {},
  ) {
    return this.patch<Api.RESTPatchAPIWebhookWithTokenMessageResult>(
      `/webhooks/${webhookId}/${token}/messages/${messageId}`,
      {
        body: data,
        ...options,
        query: {
          thread_id: options.threadId,
          ...options.query,
        },
        useAuth: false,
      },
    );
  }

  deleteWebhookMessage(
    webhookId: string,
    token: string,
    messageId: string,
    options: WebhookRequestOptions = {},
  ) {
    return this.delete<Api.RESTDeleteAPIWebhookWithTokenMessageResult>(
      `/webhooks/${webhookId}/${token}/messages/${messageId}`,
      {
        ...options,
        query: {
          thread_id: options.threadId,
          ...options.query,
        },
        useAuth: false,
      },
    );
  }

  //#endregion

  //#region Gateway

  getGateway(options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGatewayResult>('/gateway', {
      // disable auth so that it will not count towards the limit
      useAuth: false,
      ...options,
    });
  }

  getGatewayBot(options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIGatewayBotResult>('/gateway/bot', options);
  }

  //#endregion

  //#region OAuth2

  getCurrentOAuth2Authorization(options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIOAuth2CurrentAuthorizationResult>(
      '/oauth2/@me',
      options,
    );
  }

  getCurrentBotApplication(options: RequestOptions = {}) {
    return this.get<Api.RESTGetAPIOAuth2CurrentApplicationResult>(
      '/oauth2/applications/@me',
      options,
    );
  }

  //#endregion
}

// lol this is a huge file
