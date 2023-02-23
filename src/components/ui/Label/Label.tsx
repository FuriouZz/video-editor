import { ParentProps } from "solid-js";
import css from "./Label.module.scss";

export interface LabelProps extends ParentProps {}

export default function Label(props: LabelProps) {
  return (
    <div class={css.Root}>
      <div class={css.Content}>{props.children}</div>
    </div>
  );
}
