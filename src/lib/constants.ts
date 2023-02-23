export const ALLOWED_VIDEO_FILE_TYPES = [
  "video/mp4",
  "video/webm",
  "video/raw",
  "video/pack",
] as const;

export const ALLOWED_IMAGE_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export const BASE64_MIME_TYPE_REG = /^data:(\w+\/\w+);base64,/;
