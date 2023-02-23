import { createMemo, createSignal, JSX, ParentProps } from "solid-js";
import css from "./Panel.module.scss";
import Button from "../Button/Button";
import InputLabel from "../InputLabel/InputLabel";

export interface PanelProps extends ParentProps {
  label?: string;
  indent?: boolean;
  defaultCollapsed?: boolean;
  buttons?: JSX.Element;
}

export default function Panel(props: PanelProps) {
  const [collapsed, setCollapsed] = createSignal(
    props.defaultCollapsed ?? false
  );

  const onCollapse = () => {
    setCollapsed(!collapsed());
  };

  const collapseIcon = () => {
    return collapsed() ? "arrow-left" : "arrow-down";
  };

  return (
    <div class={css.Root}>
      <div class={css.Header}>
        <InputLabel className={css.InputLabel}>{props.label}</InputLabel>
        {props.buttons}
        <Button onClick={onCollapse} icon={collapseIcon()} />
      </div>
      {!collapsed() && (
        <div class={css.Content}>
          {props.indent && <div class={css.InputBlank}></div>}
          <div class={css.ContentInner}>{props.children}</div>
        </div>
      )}
    </div>
  );
}
