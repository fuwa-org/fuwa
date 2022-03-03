import { Routes } from "@splatterxl/discord-api-types";
import { Snowflake } from "../../client/ClientOptions";
import { Guild } from "../Guild";
import { GuildChannel } from "../GuildChannel";
import { BaseManager } from "./BaseManager";

export class GuildChannelManager extends BaseManager<GuildChannel> {
  constructor(public guild: Guild) {
    super(guild.client, GuildChannel)
  }

  public fetch(id: Snowflake): Promise<GuildChannel> { 
    return this.client.http.queue({
      route: Routes.channel(id)
    }).then(data => this.resolve(data)!);
  }

  public resolve(data: any): GuildChannel | void {
    if (typeof data === 'string') {
      return this.get(data as Snowflake);
    } else {
      if (this.cache.has(data.id)) {
        return this.update(this.get(data.id)!._deserialise(data));
      } else {
        return this.add(GuildChannel.create(this.guild, data));
      }
    }
  }
}
