import { ChangedoProps } from "@/types/Canvas";
import getRatio from "./getRatio";

const redo = ({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory }: ChangedoProps) => {
  pathPic.src = pathHistory[pathStep + 1];
  pathPic.onload = () => {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const ratio: number = getRatio(canvas, pathPic) as number;
    ctx?.drawImage(pathPic, 0, 0, pathPic.width * ratio, pathPic.height * ratio);
    setPathMode("");
    setPathStep(pathStep + 1);
  };
};
export default redo;
