import { ChangedoProps } from "@/types/Canvas";

const Undo = ({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory }: ChangedoProps) => {
  if (pathStep === 0) {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    pathPic.src = pathHistory[pathStep - 1];
    pathPic.onload = () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(pathPic, 0, 0, canvas.width, canvas.height);
    };
  }
  setPathMode("");
  setPathStep(pathStep - 1);
};
export default Undo;
