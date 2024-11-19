import { booleanState, stringState } from "@/types/Canvas";
import { iconOnOff } from "@/utils/diary/iconOnOff";

type ToolButtonProps = {
  icon: string;
  tool: string;
  setTool: stringState;
  setShowStroke?: booleanState;
};

const ToolButton = ({ icon, tool, setTool, setShowStroke }: ToolButtonProps) => {
  return (
    <button
      onClick={() => {
        setTool(icon);
        if (icon === "pen" || icon === "eraser") {
          if (setShowStroke) setShowStroke(true);
        }
      }}
    >
      {icon === tool ? (
        <img src={iconOnOff(icon, "on")} alt={`${icon} on`} />
      ) : (
        <img src={iconOnOff(icon, "off")} alt={`${icon} off`} />
      )}
    </button>
  );
};
export default ToolButton;
