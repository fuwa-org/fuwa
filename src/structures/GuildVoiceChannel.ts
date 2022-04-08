import { APIVoiceChannel, VideoQualityMode } from 'discord-api-types/v10';
import { BaseTextChannelInGuild } from './templates/BaseTextChannel';

export class GuildVoiceChannel extends BaseTextChannelInGuild {
  public bitrate: number | null = null;
  public region: string | null = null;
  public userLimit: number | null = null;
  public videoQuality: VideoQualityMode = VideoQualityMode.Auto;

  _deserialise(data: any) {
    super._deserialise(data as unknown as any);

    if ('bitrate' in data) this.bitrate = data.bitrate!;
    if ('rtc_region' in data) this.region = data.rtc_region!;
    if ('user_limit' in data) this.userLimit = data.user_limit!;
    if ('video_quality_mode' in data)
      this.videoQuality = data.video_quality_mode!;

    return this;
  }

  toJSON(): APIVoiceChannel {
    return {
      ...super.toJSON(),
      bitrate: this.bitrate ?? 0,
      rtc_region: this.region,
      user_limit: this.userLimit! ?? undefined,
      video_quality_mode: this.videoQuality,
      type: this.type as any,
    };
  }

  public setBitrate(bitrate: number) {
    return this.edit({ bitrate });
  }

  public setRegion(region: string) {
    return this.edit({ region });
  }

  public setUserLimit(userLimit: number) {
    return this.edit({ user_limit: userLimit });
  }

  public setVideoQualityMode(mode: VideoQualityMode) {
    return this.edit({ video_quality_mode: mode });
  }

  // voice channel is merged with stage channel for maintainability
  public createStageInstance() {
    throw new Error('Not implemented');
  }
}
