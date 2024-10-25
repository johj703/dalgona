import { ChangedoProps } from "@/types/Canvas";

const Redo = ({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory }: ChangedoProps) => {
  pathPic.src = pathHistory[pathStep + 1];
  pathPic.onload = () => {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(pathPic, 0, 0, canvas.width, canvas.height);
    setPathMode("");
    setPathStep(pathStep + 1);
  };
};
export default Redo;
