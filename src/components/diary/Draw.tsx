"use client";

import { RefObject, useRef, useState } from "react";
import Canvas from "./Canvas";
import useClientSize from "@/hooks/useClientSize";
import { LineCustom } from "@/types/LineCustom";
import { DrawProps } from "@/types/Canvas";
import Pallete from "./Pallete";
import useGetDevice from "@/hooks/useGetDevice";
import CanvasButtons from "./CanvasButtons";
import CommonTitle from "../CommonTitle";
import ToolButton from "./ToolButton";
import Stroke from "./Stroke";

const initialCustom = {
  lineWidth: "7",
  lineColor: "#000000"
};

const Draw = ({ POST_ID, setFormData, formData, setGoDraw, goDraw }: DrawProps) => {
  const wrapRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [lineCustom, setLineCustom] = useState<LineCustom>(initialCustom);
  const [pathMode, setPathMode] = useState<string>("");
  const [tool, setTool] = useState<string>("pen");
  const [showStroke, setShowStroke] = useState<boolean>(true);
  const device = useGetDevice();

  const clientRect = useClientSize(wrapRef);
  const canvasHeight = clientRect.height;
  const ratioWidth = canvasHeight * 0.633;
  const canvasWidth = ratioWidth > window.innerWidth ? clientRect.width : ratioWidth;

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLineCustom({ ...lineCustom, [id]: value });
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 flex flex-col h-dvh w-full max-w-5xl z-10 bg-white lg:flex-row lg:flex-wrap lg:bg-background02">
      <div className="shrink-0 w-full h-[100px] bg-background01 rounded-br-2xl rounded-bl-2xl overflow-hidden lg:h-auto lg:bg-transparent lg:rounded-none">
        <CommonTitle title="그림 그리기" setGoDraw={setGoDraw} />

        {device === "mobile" && <CanvasButtons setPathMode={setPathMode} />}
      </div>

      <div
        ref={wrapRef}
        className="w-full flex-1 max-h-[calc(100%-152px)] bg-background02 lg:absolute lg:top-[74px] lg:left-1/2 lg:-translate-x-1/2 lg:w-auto lg:h-full lg:max-h-full"
      >
        <Canvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          lineCustom={lineCustom}
          pathMode={pathMode}
          setPathMode={setPathMode}
          tool={tool}
          setTool={setTool}
          setFormData={setFormData}
          setGoDraw={setGoDraw}
          goDraw={goDraw}
          formData={formData}
          POST_ID={POST_ID}
          setShowStroke={setShowStroke}
        />
      </div>

      <div className="relative shrink-0 flex items-center justify-center gap-3 w-full h-[52px] bg-background01 lg:flex-col lg:w-auto lg:h-[calc(100dvh-74px)] lg:p-5 lg:justify-between ">
        <ToolButton icon="pen" tool={tool} setTool={setTool} setShowStroke={setShowStroke} />
        <ToolButton icon="eraser" tool={tool} setTool={setTool} setShowStroke={setShowStroke} />
        <ToolButton icon="pallete" tool={tool} setTool={setTool} />

        {device === "pc" && <CanvasButtons setPathMode={setPathMode} />}

        {showStroke && <Stroke lineCustom={lineCustom} handleChangeCustom={handleChangeCustom} />}

        {tool === "pallete" && (
          <Pallete lineCustom={lineCustom} setLineCustom={setLineCustom} handleChangeCustom={handleChangeCustom} />
        )}
      </div>
    </div>
  );
};
export default Draw;
