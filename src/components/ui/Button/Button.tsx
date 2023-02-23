import { createMemo, ParentProps } from "solid-js";
import { toPascalCase } from "@furiouzz/lol/string";
import css from "./Button.module.scss";
import Icon from "../Icon/Icon";

export interface ButtonProps extends ParentProps {
  href?: string;
  state?: string;
  icon?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  const hasIcon = () => {
    return props.icon && props.icon?.length > 0;
  };

  const classList = createMemo(() => {
    const classList: Record<string, boolean> = { [css.Root]: true };
    if (props.className) classList[props.className] = true;
    if (hasIcon()) classList[css.WithIcon] = true;

    if (props.state) {
      classList[css[toPascalCase(props.state) + "State"]] = true;
    } else {
      classList[css.DefaultState] = true;
    }

    return classList;
  });

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    if (props.href && props.href.length > 0) {
      window.open(props.href, "_blank");
    }
    if (props.onClick) props.onClick();
  };

  const content = createMemo(() => {
    if (hasIcon()) {
      return <Icon className={css.Icon} name={props.icon} />;
    }
    return props.children;
  });

  return (
    <div classList={classList()} onClick={onClick} title={props.title}>
      <div class={css.Container}>
        <div class={css.ContainerInner}>{content()}</div>
      </div>
    </div>
  );
}
