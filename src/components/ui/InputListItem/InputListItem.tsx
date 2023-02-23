import { JSX, mergeProps } from "solid-js";
import css from "./InputListItem.module.scss";
import Button from "../Button/Button";
import Drag from "../Drag/Drag";
import Label from "../Label/Label";

export interface InputListItemProps {
  draggable?: boolean;
  duplicate?: boolean;
  inline?: boolean;
  defaultLabel?: string;
  dragData?: {
    type: any;
    item: any;
  };
  Top?: () => JSX.Element;
  Bottom?: () => JSX.Element;
  BottomOutside?: () => JSX.Element;
  Actions?: () => JSX.Element;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onDragStart?: (items: [string, any]) => void;
  onDragEnd?: (items: [string, any]) => void;
  onDrop?: (items: [string, any]) => void;
}

export default function InputListItem(_props: InputListItemProps) {
  const props = mergeProps({ duplicate: true, inline: false }, _props);

  const onDuplicate = () => {
    if (props.onDuplicate) props.onDuplicate();
  };

  const onRemove = () => {
    if (confirm("Are you sure to delete this item?")) {
      if (props.onRemove) props.onRemove();
    }
  };

  const onDragStart = (items: [string, any]) => {
    if (props.onDragStart) props.onDragStart(items);
  };

  const onDragEnd = (items: [string, any]) => {
    if (props.onDragEnd) props.onDragEnd(items);
  };

  const onDrop = (items: [string, any]) => {
    if (props.onDrop) props.onDrop(items);
  };

  return (
    <div class={css.Root}>
      {props.inline && (
        <div class={css.Top}>
          <div class={css.TopInner}>
            {props.Top ? props.Top : <Label>{props.defaultLabel}</Label>}
          </div>
          {props.Actions && props.Actions()}
          {props.duplicate && (
            <Button
              onClick={onDuplicate}
              icon="duplicate"
              title="Duplicate item"
            />
          )}
          <Button
            onClick={onRemove}
            state="important"
            icon="garbage"
            title="Remove item"
          />
        </div>
      )}
      <div class={css.Bottom}>
        {props.draggable && (
          <Drag
            type={props.dragData?.type}
            data={props.dragData?.item}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
          >
            <div class={css.BottomOuter}>
              <div class={css.BottomInner}>
                {props.Bottom && props.Bottom()}
              </div>
              {props.inline && props.Actions && props.Actions()}
              {props.duplicate && props.inline && (
                <Button
                  onClick={onDuplicate}
                  icon="duplicate"
                  title="Duplicate item"
                />
              )}
              {props.inline && (
                <Button
                  onClick={onRemove}
                  state="important"
                  icon="garbage"
                  title="Remove item"
                />
              )}
            </div>
          </Drag>
        )}
        <div class={css.BottomOuter}>
          <div class={css.BottomInner}>{props.Bottom && props.Bottom()}</div>
          {props.inline && props.Actions && props.Actions()}
          {props.duplicate && props.inline && (
            <Button
              onClick={onDuplicate}
              icon="duplicate"
              title="Duplicate item"
            />
          )}
          {props.inline && (
            <Button
              onClick={onRemove}
              state="important"
              icon="garbage"
              title="Remove item"
            />
          )}
        </div>
        {props.BottomOutside && props.BottomOutside()}
      </div>
    </div>
  );
}
