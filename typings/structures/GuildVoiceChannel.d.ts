import { APIVoiceChannel, VideoQualityMode } from '@splatterxl/discord-api-types';
import { BaseTextChannelInGuild } from './templates/BaseTextChannel';
export declare class GuildVoiceChannel extends BaseTextChannelInGuild {
    bitrate: number | null;
    region: string | null;
    userLimit: number | null;
    videoQuality: VideoQualityMode;
    _deserialise(data: any): this;
    toJSON(): APIVoiceChannel;
    setBitrate(bitrate: number): Promise<this>;
    setRegion(region: string): Promise<this>;
    setUserLimit(userLimit: number): Promise<this>;
    setVideoQualityMode(mode: VideoQualityMode): Promise<this>;
    createStageInstance(): void;
}
