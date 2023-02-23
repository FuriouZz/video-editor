import { load as loadVideo, loadAudio } from "@furiouzz/lol/dom";
import { createMemo } from "solid-js";
import css from "./Library.module.scss";
import { useProjectContext } from "~/contexts/ProjectContext";
import LibraryItem from "~/components/LibraryItem/LibraryItem";
import { AssetLibrary } from "~/lib/data/AssetLibrary";
import InputFile from "~/components/ui/InputFile/InputFile";
import Panel from "../ui/Panel/Panel";

export default function Library() {
  const { getAllAssets, addAsset } = useProjectContext();

  const assets = createMemo(() => {
    return getAllAssets().map((asset) => {
      return <LibraryItem asset={asset} />;
    });
  });

  const onLoad = async (files: FileList) => {
    for (const file of files) {
      if (file.type.includes("video")) {
        const url = URL.createObjectURL(file);
        const data = await loadVideo(url);
        AssetLibrary.write(file.name, {
          file,
          type: "video",
          width: data.width,
          height: data.height,
          duration: data.element.duration,
        }).then(addAsset);
      } else if (file.type.includes("audio")) {
        const url = URL.createObjectURL(file);
        const data = await loadAudio(url);
        AssetLibrary.write(file.name, {
          file,
          type: "audio",
          duration: data.duration,
        }).then(addAsset);
      } else if (file.type.includes("image")) {
        AssetLibrary.write(file.name, {
          file,
          type: "image",
        }).then(addAsset);
      }
    }
  };

  return (
    <div class={css.Root}>
      <Panel label="Library">{assets}</Panel>

      <InputFile
        onNewFiles={onLoad}
        accept="video/mp4,audio/wav,audio/mp3,image/png,image/jpeg,image/webp"
      >
        Add asset
      </InputFile>
    </div>
  );
}
