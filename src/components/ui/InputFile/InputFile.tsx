import { guid } from "@furiouzz/lol/string/guid";
import { createSignal, ParentProps } from "solid-js";
import css from "./InputFile.module.scss";

interface InputFileProps extends ParentProps {
  accept?: string;
  clear?: boolean;
  onNewFiles?: (files: FileList) => void;
}

export default function InputFile(props: InputFileProps) {
  const uuid = guid();
  const [dragging, setDragging] = createSignal(false);

  let $input: HTMLInputElement | undefined = undefined;

  const onInput = () => {
    if ($input?.files && props.onNewFiles) {
      props.onNewFiles($input?.files);
    }
  };

  const onDrag = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer?.files && props.onNewFiles) {
      props.onNewFiles(e.dataTransfer?.files);
    }

    if ($input) $input.value = "";
  };

  return (
    <div
      classList={{
        [css.Root]: true,
        [css.Drag]: dragging(),
      }}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragEnd={onDrop}
      onDrop={onDrop}
    >
      <label for={uuid}>
        <span>{props.children}</span>
      </label>

      <input
        type="file"
        id={uuid}
        multiple
        onInput={onInput}
        ref={$input}
        accept={props.accept}
      />
    </div>
  );
}
