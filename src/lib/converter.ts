const canvas = document.createElement("canvas");
const BMPRenderer = canvas.getContext("bitmaprenderer");
export async function bitmapToBlob(
  bmp: ImageBitmap,
  type?: string,
  quality?: any
) {
  if (!BMPRenderer) return null;
  BMPRenderer.canvas.width = bmp.width;
  BMPRenderer.canvas.height = bmp.height;
  BMPRenderer.transferFromImageBitmap(bmp);
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}
