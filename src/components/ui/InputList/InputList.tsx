import { createMemo, createSignal, JSX, mergeProps, onMount } from "solid-js";
import { deepClone, merge, expose } from "@furiouzz/lol/object";
import InputLabel from "../InputLabel/InputLabel";
import css from "./InputList.module.scss";
import Button from "../Button/Button";
import InputListItem from "../InputListItem/InputListItem";
import { reorder } from "~/lib/utils";

export interface InputListProps {
  schema?: () => any;
  uniqueKeys?: (keys: string[]) => string[];
  data?: any;
  dataKey?: string | number;
  filter?: string[];
  label?: string;
  pixelPerSeconds?: number;
  dragType?: string;
  inline?: boolean;
  expand?: boolean;
  duplicate?: boolean;
  onAdd?: () => void;
  onRemove?: (item: any, index: number) => void;

  Actions?: () => JSX.Element;
  ItemTop?: () => JSX.Element;
  ItemBottom?: () => JSX.Element;
  ItemBottomOutside?: () => JSX.Element;
  ItemActions?: () => JSX.Element;
}

export default function InputList(_props: InputListProps) {
  const props = mergeProps(
    {
      dataKey: "value",
      filter: [] as string[],
      label: "List",
      pixelPerSeconds: 1000,
      inline: false,
      expand: false,
      duplicate: true,
    },
    _props
  );

  const [collapsed, setCollapsed] = createSignal(props.expand);
  const [dragged, setDragged] = createSignal<any>(null);

  const datas = createMemo(() => {
    if (
      !props.data ||
      !props.dataKey ||
      !Array.isArray(props.data[props.dataKey])
    ) {
      return null;
    }

    return props.data[props.dataKey] as any[];
  });

  const items = createMemo(() => {
    const items = datas();
    if (!items) return null;

    return items.map((item: any, i) => {
      return (
        <InputListItem
          dragData={onDragData(item)}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrop={onDrop}
          onRemove={() => {
            onRemove(item, i);
          }}
          onDuplicate={() => {
            onDuplicate(item, i);
          }}
          Actions={() => {
            return <>{props.ItemActions && props.ItemActions()}</>;
          }}
          Top={() => {
            return <>{props.ItemTop && props.ItemTop()}</>;
          }}
          Bottom={() => {
            return <>{props.ItemBottom && props.ItemBottom()}</>;
          }}
          BottomOutside={() => {
            return <>{props.ItemBottomOutside && props.ItemBottomOutside()}</>;
          }}
          defaultLabel={String(i)}
          duplicate={props.duplicate}
          inline={props.inline}
        />
      );
    });
  });

  const isEmpty = createMemo(() => {
    return props.data && props.dataKey
      ? props.data[props.dataKey].length
      : true;
  });

  const onAdd = () => {
    if (props.onAdd) props.onAdd();
    const items = datas();
    if (!items || !props.schema) return;
    items.push(props.schema());
    setCollapsed(false);
  };

  const onDuplicate = (item: any, index: number) => {
    if (props.onAdd) props.onAdd();

    const items = datas();
    if (!items) return;

    if (typeof item == "string") {
      items[items.length - 1] = item;
    } else if (typeof item == "object") {
      const last = items[items.length - 1];
      const keys: string[] = [];
      if (typeof props.uniqueKeys == "function") props.uniqueKeys(keys);
      merge(last, deepClone(item), deepClone(expose(last, ...keys)));
    }
  };

  const onRemove = (item: any, index: number) => {
    let items = datas();
    if (!items) return;
    items = deepClone(items);
    items.splice(index, 1);
    props.data[props.dataKey] = items;
    if (props.onRemove) props.onRemove(item, index);
    if (isEmpty()) setCollapsed(true);
  };

  const onCollapse = () => {
    setCollapsed(isEmpty() ? collapsed() : !collapsed());
  };

  const onDragData = (item: any) => {
    if (props.dragType) {
      return {
        type: props.dragType,
        item,
      };
    }
    return undefined;
  };

  const onDragStart = ([type, data]: [string, any]) => {
    if (props.dragType !== type) return;
    setDragged(data);
  };

  const onDragEnd = () => {};

  const onDrop = ([type, data]: [string, any]) => {
    if (props.dragType !== type) return;
    const items = reorder(
      dragged(),
      data,
      deepClone(props.data[props.dataKey])
    );
    props.data[props.dataKey] = items;
  };

  return (
    <div class={css.Root}>
      <div class={css.Header}>
        <InputLabel type="LIST">{props.label}</InputLabel>
        <div class={css.Buttons}>
          {props.Actions && props.Actions()}
          {props.filter.includes("add") && (
            <Button onClick={onAdd} icon="plus" title="Add item" />
          )}
          <Button
            onClick={onCollapse}
            state={isEmpty() ? "default" : "disabled"}
            icon={collapsed() ? "arrow-left" : "arrow-down"}
            title={collapsed() ? "Expand" : "Collapse"}
          />
        </div>
      </div>

      <div class={css.Outer} style={{ display: !collapsed() ? "" : "none" }}>
        <div class={css.Inner}>
          <div class={css.InputBlank}></div>
          <div class={css.Items}>{items()}</div>
          <div class={css.InputBlank}></div>
        </div>
      </div>
    </div>
  );
}
