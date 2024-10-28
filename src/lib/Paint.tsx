import hexToRgba from "hex-to-rgba";

export const convertHexToRgba = (color: string) => {
  const rgbaStr = hexToRgba(color);
  const rgba = rgbaStr
    .substring(5, rgbaStr.length - 1)
    .split(",")
    .map((str: string) => Number(str));
  rgba[3] = rgba[3] * 255;
  return new Uint8ClampedArray(rgba);
};

export const isValidSquare = (imageData: ImageData, x: number, y: number) => {
  return x >= 0 && x < imageData.width && y >= 0 && y < imageData.height;
};

export const getPixelOffset = (imageData: ImageData, x: number, y: number) => {
  return (y * imageData.width + x) * 4;
};

export const getPixelColor = (imageData: ImageData, x: number, y: number) => {
  if (isValidSquare(imageData, x, y)) {
    const offset = getPixelOffset(imageData, x, y);
    return imageData.data.slice(offset, offset + 4);
  } else {
    return [-1, -1, -1, -1]; // invalid color
  }
};

export function isSameColor(a: Uint8ClampedArray, b: Uint8ClampedArray) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

export const setPixel = (imageData: ImageData, x: number, y: number, color: Uint8ClampedArray) => {
  const offset = (y * imageData.width + x) * 4;
  imageData.data[offset + 0] = color[0];
  imageData.data[offset + 1] = color[1];
  imageData.data[offset + 2] = color[2];
  imageData.data[offset + 3] = color[3];
};

export const floodFill = (x: number, y: number, fillColor: Uint8ClampedArray, ctx: CanvasRenderingContext2D | null) => {
  const imageData = ctx?.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (imageData) {
    const visited = new Uint8Array([imageData.width, imageData.height]);
    const targetColor = getPixelColor(imageData, x, y) as Uint8ClampedArray;

    if (!isSameColor(targetColor, fillColor)) {
      const stack = [{ x, y }];
      while (stack.length > 0) {
        const child = stack.pop();
        if (!child) return;
        const currentColor = getPixelColor(imageData, child.x, child.y);
        if (
          !visited[child.y * imageData.width + child.x] &&
          isSameColor(currentColor as Uint8ClampedArray, targetColor)
        ) {
          setPixel(imageData, child.x, child.y, fillColor);
          visited[child.y * imageData.width + child.x] = 1;
          stack.push({ x: child.x + 1, y: child.y });
          stack.push({ x: child.x - 1, y: child.y });
          stack.push({ x: child.x, y: child.y + 1 });
          stack.push({ x: child.x, y: child.y - 1 });
        }
      }
      ctx?.putImageData(imageData, 0, 0);
    }
  }
};
