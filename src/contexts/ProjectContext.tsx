import { createContext, createSignal, ParentProps, useContext } from "solid-js";
import { AssetLibrary } from "../lib/data/AssetLibrary.js";
import { IAsset } from "../types.js";

interface IProjectContext {
  getAllAssets(): IAsset[];
  addAsset(asset: IAsset): void;
}

const LibraryContext = createContext<IProjectContext | null>(null);

export function useProjectContext() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("Cannot use Library outside <LibraryProvider>");
  return ctx;
}

export function ProjectProvider(props: ParentProps) {
  const [assets, setAssets] = createSignal<IAsset[]>([]);

  const value: IProjectContext = {
    getAllAssets: assets,
    addAsset(asset) {
      setAssets([...assets(), asset]);
    },
  };

  AssetLibrary.list().then((entries) => {
    const items = entries.map(([, v]) => v);
    setAssets([...assets(), ...items]);
  });

  return (
    <LibraryContext.Provider value={value}>
      {props.children}
    </LibraryContext.Provider>
  );
}
