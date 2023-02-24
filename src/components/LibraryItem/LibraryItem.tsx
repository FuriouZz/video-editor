import VideoLayer from "../layers/VideoLayer/VideoLayer";
import css from "./LibraryItem.module.scss";

export default function LibraryItem(props: { asset: TY.IAsset }) {
  return (
    <div class={css.Root}>
      {props.asset.type === "video" && <VideoLayer asset={props.asset} />}
    </div>
  );
}
