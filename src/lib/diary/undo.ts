import { ChangedoProps } from "@/types/Canvas";
import GetRatio from "./getRatio";

const undo = ({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory }: ChangedoProps) => {
  if (pathStep === 0) {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    // saveHistory();
  } else {
    pathPic.src = pathHistory[pathStep - 1];
    pathPic.onload = () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      const ratio: number = GetRatio(canvas, pathPic) as number;
      ctx?.drawImage(pathPic, 0, 0, pathPic.width * ratio, pathPic.height * ratio);
    };
  }
  setPathMode("");
  setPathStep(pathStep - 1);
};
export default undo;
