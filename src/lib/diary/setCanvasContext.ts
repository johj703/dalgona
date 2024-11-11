import { Context } from "@/types/Canvas";

const setCanvasContext = ({ canvas, canvasContext, canvasWidth, canvasHeight }: Context) => {
  const devicePixelRatio = window.devicePixelRatio ?? 1;
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  canvas.width = canvasWidth * devicePixelRatio;
  canvas.height = canvasHeight * devicePixelRatio;

  canvasContext.scale(devicePixelRatio, devicePixelRatio);

  canvasContext.lineJoin = "round";
  canvasContext.lineCap = "round";
  canvasContext.globalCompositeOperation = "source-over";
  return canvasContext;
};
export default setCanvasContext;
