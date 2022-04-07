import { VideoQualityMode } from '@splatterxl/discord-api-types';
import { GuildChannel } from '../GuildChannel';
export declare class BaseGuildVoiceChannel extends GuildChannel {
    bitrate: number | null;
    region: string | null;
    userLimit: number | null;
    videoQuality: VideoQualityMode;
    _deserialise(data: any): this;
    toJSON(): {
        bitrate: number | null;
        region: string | null;
        user_limit: number | null;
        video_quality_mode: VideoQualityMode;
        guild_id?: string | undefined;
        permission_overwrites?: import("@splatterxl/discord-api-types").APIOverwrite[] | undefined;
        position?: number | undefined;
        parent_id?: string | null | undefined;
        nsfw?: boolean | undefined;
        type: import("@splatterxl/discord-api-types").GuildChannelType;
        id: string;
        name?: string | undefined;
    };
    setBitrate(bitrate: number): Promise<this>;
    setRegion(region: string): Promise<this>;
    setUserLimit(userLimit: number): Promise<this>;
    setVideoQualityMode(mode: VideoQualityMode): Promise<this>;
}
