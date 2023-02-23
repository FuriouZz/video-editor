import {
  createSignal,
  mergeProps,
  onMount,
  onCleanup,
  ParentProps,
} from "solid-js";
import { createClassList, createClassName } from "~/lib/hooks/classList";
import Icon from "../Icon/Icon";
import css from "./Drag.module.css";

export interface DragProps extends ParentProps {
  type?: string;
  data?: any;

  onDragStart?: (items: [string, any]) => void;
  onDragEnd?: (items: [string, any]) => void;
  onDrop?: (items: [string, any]) => void;
}

export default function Drag(_props: DragProps) {
  const props = mergeProps({ type: "__drag__", data: {} }, _props);

  const [dragged, setDragged] = createSignal(false);
  const [droppable, setDroppable] = createSignal(false);
  const [hover, setHover] = createSignal(false);

  const classList = createClassList(css.Root, {
    get [css.Dragged]() {
      return dragged();
    },
    get [css.Droppable]() {
      return droppable() && !dragged();
    },
    get [css.Hover]() {
      return hover();
    },
  });

  onMount(() => {
    // NC.dragStart.on(onItemDrag)
    // NC.dragEnd.on(onItemDrop)
  });

  onCleanup(() => {
    // NC.dragStart.off(onItemDrag)
    // NC.dragEnd.off(onItemDrop)
  });

  const onItemDrag = ([type]: [string, any]) => {
    setDroppable(props.type == type);
  };

  const onItemDrop = () => {
    setDroppable(false);
  };

  const isDraggable = (e: DragEvent) => {
    return e.target == e.currentTarget;
  };

  const onDragStart = (e: DragEvent) => {
    if (!isDraggable(e)) return;
    setDragged(true);
    if (props.onDragStart) props.onDragStart([props.type, props.data]);
    // NC.dragStart.dispatch([type, data]);
  };

  const onDragEnd = (e: DragEvent) => {
    if (!isDraggable(e)) return;
    setDragged(false);
    if (props.onDragEnd) props.onDragEnd([props.type, props.data]);
    // NC.dragEnd.dispatch([type, data]);
  };

  const onDragEnter = (e: DragEvent) => {
    if (!isDraggable(e)) return;
    if (!droppable()) return;
    setHover(true);
  };

  const onDragLeave = (e: DragEvent) => {
    if (!isDraggable(e)) return;
    setHover(false);
  };

  const onDrop = (e: DragEvent) => {
    if (!isDraggable(e)) return;
    if (!droppable()) return;
    if (props.onDrop) props.onDrop([props.type, props.data]);
    // NC.drop.dispatch([type, data]);
  };

  const onDragOver = (e: DragEvent) => {
    if (!isDraggable(e)) return;
    if (!droppable()) return;
    e.preventDefault();
  };

  return (
    <div
      classList={classList()}
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragExit={onDragLeave}
      data-drag-type={props.type}
    >
      <div class={css.Box}>
        <Icon name="drag" />
      </div>
      <div class={css.Content}>{props.children}</div>
    </div>
  );
}
