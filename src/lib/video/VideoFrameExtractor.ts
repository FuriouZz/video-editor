export default class VideoFrameExtractor {
  tracks?: {
    videoTracks: MediaStreamVideoTrack[];
    audioTracks: MediaStreamAudioTrack[];
  };
  processor?: MediaStreamTrackProcessor<VideoFrame>;
  reader?: ReadableStreamDefaultReader<VideoFrame>;
  video?: HTMLVideoElement;

  ready = false;
  processing = false;

  constructor(public asset: TY.IVideoAsset) {}

  async init() {
    if (!this.ready) {
      const { video, tracks } = await this.#getTrack();
      this.tracks = tracks;
      this.video = video;
      this.processor = new MediaStreamTrackProcessor({
        track: this.tracks!.videoTracks[0],
      });
      this.reader = this.processor.readable.getReader();
      this.ready = true;
    }
  }

  async pick(t: number) {
    if (!window.MediaStreamTrackProcessor || this.processing) return;
    this.processing = true;

    await this.init();

    const video = this.video!;
    video.currentTime = t * video.duration;
    this.#waitSeek();

    const result = await this.#readChunk();
    this.processing = false;
    return result;
  }

  async #getTrack() {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = URL.createObjectURL(this.asset.file);

    await new Promise<void>((resolve) => {
      video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      video.load();
    });

    const stream = video.captureStream();
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    video.addEventListener("ended", () => {
      videoTracks.forEach((v) => v.stop());
      audioTracks.forEach((a) => a.stop());
    });
    return { video, tracks: { videoTracks, audioTracks } };
  }

  async #readChunk() {
    const reader = this.reader!;
    const result = await reader.read();
    if (result.value) {
      const bitmap = await createImageBitmap(result.value);
      result.value.close();
      return bitmap;
    }
  }

  async #waitSeek() {
    const video = this.video;
    if (!video) return;
    await new Promise<void>((resolve) => {
      if (video.seeking) {
        video.addEventListener("seeked", () => resolve(), { once: true });
      } else {
        resolve();
      }
    });
  }
}
