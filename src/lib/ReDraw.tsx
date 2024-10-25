import { ReDrawProps } from "@/types/Canvas";
import GetRatio from "./GetRatio";

const ReDraw = ({ pathHistory, canvas, canvasContext }: ReDrawProps) => {
  const canvasPic = new Image();
  canvasPic.src = pathHistory[pathHistory.length - 1];

  const ratio: number = GetRatio(canvas, canvasPic) as number;

  canvasPic.onload = () => canvasContext?.drawImage(canvasPic, 0, 0, canvasPic.width * ratio, canvasPic.height * ratio);
};
export default ReDraw;
