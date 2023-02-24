import { createEffect, createMemo } from "solid-js";
import VideoTimelineViewer from "~/lib/video/VideoTimelineViewer";
import css from "./VideoLayer.module.scss";

export interface IVideoLayerProps {
  asset: TY.IVideoAsset;
}

export default function VideoLayer(props: IVideoLayerProps) {
  let $el: HTMLDivElement | undefined = undefined;

  const tl = createMemo(() => new VideoTimelineViewer(props.asset));

  createEffect(() => {
    const timeline = tl();
    timeline.render();
    if ($el) $el.append(timeline.canvas);
    return () => {
      timeline.canvas.remove();
    };
  });

  return <div class={css.Root} ref={$el}></div>;
}
