declare namespace TY {
  export interface IVideoAsset {
    file: File;
    type: "video";
    width: number;
    height: number;
    duration: number;
  }

  export interface IAudioAsset {
    file: File;
    type: "audio";
    duration: number;
  }

  export interface IImageAsset {
    file: File;
    type: "image";
  }

  export type IAsset = IVideoAsset | IAudioAsset | IImageAsset;
}
