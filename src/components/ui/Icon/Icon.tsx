import { ClassNameValue, createClassList } from "~/lib/hooks/classList";
import css from "./Icon.module.scss";

export interface IconProps {
  name: string;
  className?: ClassNameValue;
  inverse?: boolean;
}

export default function Icon(props: IconProps) {
  const classList = createClassList(css.Root, props.className, {
    inverse: props.inverse,
  });

  const iconClassList = createClassList(
    css.flaticon,
    css["flaticon-" + props.name]
  );

  return (
    <div classList={classList()}>
      {props.name === "drag" && (
        <>
          <i class="dot"></i>
          <i class="dot"></i>
          <i class="dot"></i>
          <i class="dot"></i>
        </>
      )}

      {props.name !== "drag" && (
        <>
          <i classList={iconClassList()}></i>
        </>
      )}
    </div>
  );
}
