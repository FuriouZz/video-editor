import { VideoData, AudioData } from "@furiouzz/lol/dom/index.js";

export type IAsset = {
  file: File;
} & (
  | {
      type: "video";
      width: number;
      height: number;
      duration: number;
    }
  | {
      type: "audio";
      duration: number;
    }
  | {
      type: "image";
    }
);
