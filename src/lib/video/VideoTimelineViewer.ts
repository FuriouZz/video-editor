import { observeResize } from "../observers/ResizeObserver";
import VideoFrameExtractor from "./VideoFrameExtractor";

export default class VideoTimelineViewer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  extractor: VideoFrameExtractor;
  thumbnailWidth = 100;
  count = 20;
  rendering = false;
  needsUpdate = true;

  constructor(asset: TY.IVideoAsset) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.extractor = new VideoFrameExtractor(asset);
    observeResize(this.canvas, this.onResize.bind(this));
  }

  onResize() {
    const computed = getComputedStyle(this.canvas);
    const width = parseInt(computed.width);
    const height = parseInt(computed.height);
    this.canvas.width = width;
    this.canvas.height = height;
    this.needsUpdate = true;
    this.render();
  }

  async render() {
    if (!this.ctx) return;
    if (this.rendering) return;
    this.rendering = true;
    this.needsUpdate = false;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let frame = 0; frame <= this.count; frame++) {
      if (this.needsUpdate) continue;
      await this.renderFrame(frame);
    }

    this.rendering = false;
    if (this.needsUpdate) this.render();
  }

  async renderFrame(frame: number) {
    if (!this.ctx) return;

    const t = frame / this.count;
    const bitmap = await this.extractor.pick(t);
    if (!bitmap) return;

    const offsetWidth = (1 / this.count) * this.canvas.width;
    const ratio = bitmap.width / bitmap.height;

    const width = this.thumbnailWidth;
    const height = width / ratio;
    let x = frame * offsetWidth;
    let y = 0;

    // COVER
    const finalRatio = Math.max(
      width / this.thumbnailWidth,
      height / this.canvas.height
    );

    const w = this.thumbnailWidth / finalRatio;
    const h = w / ratio;

    x += (w - this.thumbnailWidth) * 0.5;
    y += (h - this.canvas.height) * 0.5;

    this.ctx.drawImage(bitmap, x, y, w, h);
    bitmap.close();
  }
}
