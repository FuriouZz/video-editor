import { ParentProps } from "solid-js";
import css from "./Link.module.scss";
import Icon from "../Icon/Icon";

export interface LinkProps extends ParentProps {
  href?: string;
  icon?: string;
  onClick?: (e: MouseEvent) => void;
}

export default function Link(props: LinkProps) {
  return (
    <a class={css.Root} href={props.href} onClick={props.onClick}>
      {props.icon && <Icon name={props.icon} />}
      {props.children}
    </a>
  );
}
