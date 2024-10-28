import { ReDrawProps } from "@/types/Canvas";
import GetRatio from "./GetRatio";

const ReDraw = ({ pathHistory, canvas, canvasContext, pathStep }: ReDrawProps) => {
  const canvasPic = new Image();
  canvasPic.src = pathHistory[pathStep];

  const ratio: number = GetRatio(canvas, canvasPic) as number;

  canvasPic.onload = () => canvasContext?.drawImage(canvasPic, 0, 0, canvasPic.width * ratio, canvasPic.height * ratio);
};
export default ReDraw;
