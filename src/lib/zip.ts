import { guid } from "@furiouzz/lol/string";
import type JSZip from "jszip";
import { getFileExtension } from "./file.js";

interface ZipObject {
  [key: string | number | symbol]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Blob
    | File
    | ArrayBuffer
    | Uint8Array
    | number[]
    | ZipObject;
}

async function importJSZip() {
  const imp = await import("jszip");
  return imp.default;
}

function encodeValue(zip: JSZip, value: ZipObject[any]): any {
  if (value instanceof Blob) {
    const extension = getFileExtension(value);
    const name = guid();
    const path = `blob-${name}${extension}`;
    const ret = {
      type: "blob",
      path,
      blob: { extends: "blob", type: value.type, name },
    };

    if (typeof File !== "undefined" && value instanceof File) {
      ret.blob.extends = "file";
      ret.blob.name = value.name;
    }

    zip.file(ret.path, value);
    return ret;
  } else if (value instanceof ArrayBuffer) {
    const name = guid();
    const path = `arraybuffer-${name}`;
    zip.file(path, value);
    return { type: "arraybuffer", path };
  } else if (value instanceof Uint8Array) {
    const name = guid();
    const path = `uint8array-${name}`;
    zip.file(path, value);
    return { type: "uint8array", path };
  } else if (Array.isArray(value)) {
    const array = value.map((v) => encodeValue(zip, v));
    return { type: "array", array };
  } else if (typeof value === "object" && value !== null) {
    const object = _zip(zip, value);
    return { type: "object", object };
  }
  return value;
}

async function decodeValue(zip: JSZip, value: any): Promise<any> {
  if (value.type === "blob") {
    const buffer = await zip.file(value.path)?.async("arraybuffer");

    if (value.blob.extends === "file" && typeof File !== "undefined") {
      return new File([buffer!], value.blob.name, { type: value.blob.type });
    }

    return new Blob([buffer!], { type: value.blob.type });
  } else if (value.type === "arraybuffer") {
    return zip.file(value.path)?.async("arraybuffer");
  } else if (value.type === "uint8array") {
    return zip.file(value.path)?.async("uint8array");
  } else if (value.type === "array") {
    return Promise.all(value.array.map((v: any) => decodeValue(zip, v)));
  } else if (value.type === "object") {
    return _unzip(zip, value.object);
  }
  return value;
}

function _zip(zip: JSZip, object: ZipObject) {
  const json: any = {};

  for (const key in object) {
    const value = encodeValue(zip, object[key]);
    json[key] = value;
  }

  return json;
}

async function _unzip(zip: JSZip, object: any) {
  const json: any = {};

  for (const key in object) {
    const value = await decodeValue(zip, object[key]);
    json[key] = value;
  }

  return json;
}

export async function zip(
  object: any,
  options?: Omit<JSZip.JSZipGeneratorOptions, "type">
) {
  const JSZip = await importJSZip();
  const zip = new JSZip();
  const json: any = _zip(zip, object);
  zip.file("data.json", JSON.stringify(json));
  return zip.generateAsync({ ...options, type: "blob" });
}

export async function unzip<T = unknown>(
  blob: Blob | File,
  options?: JSZip.JSZipLoadOptions
) {
  const JSZip = await importJSZip();
  const zip = await JSZip.loadAsync(blob, options);
  const str = await zip.file("data.json")?.async("string");
  if (!str) {
    throw new Error(
      `[utils] This file is not built with zip() function. Use loadZipFile instead.`
    );
  }
  const json = JSON.parse(str);
  return _unzip(zip, json) as T;
}

export async function loadZipFile(url: string) {
  const JSZip = await importJSZip();
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return JSZip.loadAsync(buffer);
}
