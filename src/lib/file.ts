import { BASE64_MIME_TYPE_REG } from "./constants.js";

export type FileResponse = "arraybuffer" | "binarystring" | "dataurl" | "text";

export interface FileData {
  file: File | Blob;
  type: FileResponse;
  reader: FileReader;
  response: string | ArrayBuffer;
}

export type FileSetup = (element: FileReader) => void;

export function loadFile(
  file: File | Blob,
  type: FileResponse,
  setup?: FileSetup
) {
  return new Promise<FileData>((resolve, reject) => {
    const reader = new FileReader();
    if (typeof setup === "function") setup(reader);

    const unbind = () => {
      reader.removeEventListener("error", onError);
      reader.removeEventListener("load", onLoad);
    };

    const onError = (event: ProgressEvent<FileReader>) => {
      unbind();
      reject(event);
    };

    const onLoad = () => {
      unbind();

      if (!reader.result) {
        reject("[FileReader] No result found");
        return;
      }

      resolve({
        file,
        type,
        reader,
        response: reader.result,
      });
    };

    reader.addEventListener("error", onError, { once: true });
    reader.addEventListener("load", onLoad, { once: true });

    if (type == "arraybuffer") {
      reader.readAsArrayBuffer(file);
    } else if (type == "binarystring") {
      reader.readAsBinaryString(file);
    } else if (type == "dataurl") {
      reader.readAsDataURL(file);
    } else if (type == "text") {
      reader.readAsText(file);
    }
  });
}

export const loadBlob = loadFile;

export function base64ToFile(dataurl: string, options?: { name?: string }) {
  const match = dataurl.match(BASE64_MIME_TYPE_REG);
  if (!match || !match[1]) throw new Error("[utils] Invalid data URL");

  const mime = match[1];
  const bstr = atob(dataurl.replace(BASE64_MIME_TYPE_REG, ""));

  let n = bstr.length;
  const buffer = new Uint8Array(n);
  while (n--) {
    buffer[n] = bstr.charCodeAt(n);
  }

  const name = options?.name ?? `file${getFileExtension(mime)}`;
  return new File([buffer], name, { type: mime });
}

export function getFileExtension(file: File | Blob | string) {
  let mimeType: string | undefined;

  if (typeof file === "string") {
    const match = file.match(BASE64_MIME_TYPE_REG);
    if (match && match[1]) {
      mimeType = match[1];
    } else {
      mimeType = file;
    }
  } else {
    mimeType = file.type;
  }

  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "video/mp4":
      return ".mp4";
    case "video/webm":
      return ".webm";
    case "application/x-msgpack":
      return ".pack";
    case "application/zip":
      return ".zip";
    case "application/json":
      return ".json";
  }

  throw new Error(`[utils] Unknown mime type: ${mimeType}`);
}

export function download(
  urlOrBlob: string | Blob | File,
  {
    name,
    revokeURL = true,
    revokeTimeout = 100,
  }: { name?: string; revokeURL?: boolean; revokeTimeout?: number } = {}
) {
  let url: string;
  let needsRevoke = false;

  if (typeof urlOrBlob === "string") {
    url = urlOrBlob;
  } else {
    url = URL.createObjectURL(urlOrBlob);
    needsRevoke = true;
  }

  if (!name) {
    if (urlOrBlob instanceof File && urlOrBlob.name) {
      name = urlOrBlob.name;
    } else {
      try {
        const extension = getFileExtension(urlOrBlob);
        name = `file${extension}`;
      } catch (e) {
        name = "file";
      }
    }
  }

  const $a = document.createElement("a");
  $a.href = url;
  $a.download = name;
  document.body.appendChild($a);
  $a.click();
  setTimeout(() => {
    document.body.removeChild($a);
    if (needsRevoke && revokeURL) {
      URL.revokeObjectURL(url);
    }
  }, revokeTimeout);
}
