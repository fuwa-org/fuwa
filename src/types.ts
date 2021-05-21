export type ImageFormat = "webp" | "gif" | "jpg" | "jpeg" | "png";
export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export interface ImageURLOptions {
  format: ImageFormat;
  size: ImageSize;
  dynamic: boolean;
}
