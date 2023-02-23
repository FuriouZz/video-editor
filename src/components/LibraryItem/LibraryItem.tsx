import css from "./LibraryItem.module.scss";
import { IAsset } from "../../types";

export default function LibraryItem(props: { asset: IAsset }) {
  return (
    <div class={css.Root}>
      <div>{props.asset.file.name}</div>
    </div>
  );
}
