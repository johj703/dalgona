import { stringState } from "@/types/Canvas";

const CanvasButtons = ({ setPathMode }: { setPathMode: stringState }) => {
  return (
    <div className="flex gap-2 lg:flex-col lg:gap-4 lg:mt-auto">
      <button className="mr-auto lg:order-4 lg:mr-0" onClick={() => setPathMode("save")}>
        <img src="/icons/save.svg" alt="저장" />
      </button>
      <button className="lg:order-3" onClick={() => setPathMode("reset")}>
        <img src="/icons/reset.svg" alt="reset" />
      </button>
      <button className="lg:order-1" onClick={() => setPathMode("undo")}>
        <img src="/icons/undo.svg" alt="undo" />
      </button>
      <button className="lg:order-2" onClick={() => setPathMode("redo")}>
        <img src="/icons/redo.svg" alt="redo" />
      </button>
    </div>
  );
};
export default CanvasButtons;
