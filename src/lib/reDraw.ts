import { ReDrawProps } from "@/types/Canvas";
import getRatio from "./getRatio";

const reDraw = ({ pathHistory, canvas, canvasContext, pathStep }: ReDrawProps) => {
  const canvasPic = new Image();
  canvasPic.src = pathHistory[pathStep];

  const ratio: number = getRatio(canvas, canvasPic) as number;

  canvasPic.onload = () => canvasContext?.drawImage(canvasPic, 0, 0, canvasPic.width * ratio, canvasPic.height * ratio);
};
export default reDraw;
