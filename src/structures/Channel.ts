import { APIChannel, ChannelType, Routes } from "@splatterxl/discord-api-types";
import { Snowflake } from "../client/ClientOptions";
import { DataTransformer } from "../rest/DataTransformer";
import { Guild } from "./Guild";
import { BaseStructure } from "./templates/BaseStructure";

export class Channel<T extends APIChannel = APIChannel> extends BaseStructure<T> {
  public id!: Snowflake;
  public type: ChannelType = ChannelType.GuildCategory;
  public guild: Guild | null = null;

  _deserialise(data: T & { guild_id: Snowflake }): this {
    this.id = data.id as Snowflake;
    if ("type" in data) this.type = data.type as ChannelType;
    if ("guild_id" in data) { 
      this.guild = this.client.guilds.get(data.guild_id as Snowflake) ?? null;

      setTimeout((async () => {
        this.guild = await this.client.guilds.fetch(data.guild_id as Snowflake)!;
      }).bind(this), 0)
    }

    return this;
  }

  /**
   * @internal
   */
  edit(data: any) {
    return this.client.http.queue({
      route: Routes.channel(this.id),
      method: "PATCH", 
      body: DataTransformer.asJSON(data),
    })
  }

  public delete() {
    return this.client.http.queue({
      route: Routes.channel(this.id),
      method: "DELETE",
    })
  } 
}
