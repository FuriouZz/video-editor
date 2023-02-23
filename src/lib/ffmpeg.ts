import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import { IAsset } from "../types";

let FFMPEG: Promise<FFmpeg>;

async function load() {
  if (FFMPEG) return FFMPEG;
  FFMPEG = new Promise((resolve) => {
    const _ffmpeg = createFFmpeg({
      log: true,
    });
    _ffmpeg.load().then(() => {
      resolve(_ffmpeg);
    });
  });
  return FFMPEG;
}

export async function getFrames(
  video: Uint8Array,
  filename: string,
  options?: {
    size?: number;
    frame?: number;
  }
): Promise<IAsset> {
  const { size, frame } = { size: 128, frame: 100, ...options };

  const ffmpeg = await load();
  ffmpeg.FS("writeFile", "input.mp4", video);

  await ffmpeg.run(
    "-i",
    "input.mp4",
    "-vf",
    `fps=1,scale=${size}:-1`,
    ...(Number.isFinite(frame) ? ["-vframes", String(frame)] : []),
    "out%d.jpg"
  );
  const entries = ffmpeg.FS("readdir", "/");
  const framesByName: Record<string, Uint8Array> = {};

  for (const entry of entries) {
    if (!/out\d+.(png|jpg)/.test(entry)) continue;
    const frame = ffmpeg.FS("readFile", entry);
    framesByName[entry] = frame;
    ffmpeg.FS("unlink", entry);
  }

  return {
    Video: {
      filename,
      video,
      frames: Object.keys(framesByName)
        .sort((a, b) => a.localeCompare(b))
        .map((k) => framesByName[k]),
    },
  };
}
