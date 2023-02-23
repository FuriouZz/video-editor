import { ParentProps } from "solid-js";
import css from "./InputLabel.module.scss";
import { ClassNameValue, createClassList } from "~/lib/hooks/classList";

export interface InputLabelProps extends ParentProps {
  type?: string;
  className?: ClassNameValue;
}

export default function InputLabel(props: InputLabelProps) {
  const classList = createClassList(props.className, css.Root);
  return (
    <div classList={classList()}>
      <div class={css.Content}>{props.children}</div>
      {props.type && props.type.length > 0 && (
        <div class={css.Type}>{props.type}</div>
      )}
    </div>
  );
}
