"use client";

import { RefObject, useRef, useState } from "react";
import Canvas from "./Canvas";
import useClientSize from "@/hooks/useClientSize";
import { LineCustom } from "@/types/LineCustom";
import { DrawProps } from "@/types/Canvas";
import Pallete from "./Pallete";
import { iconOnOff } from "@/utils/diary/iconOnOff";
import useGetDevice from "@/hooks/useGetDevice";
import CanvasButtons from "./CanvasButtons";
import CommonTitle from "../CommonTitle";

const initialCustom = {
  lineWidth: "7",
  lineColor: "#000000"
};

const Draw = ({ POST_ID, setFormData, formData, setGoDraw, goDraw }: DrawProps) => {
  const wrapRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [lineCustom, setLineCustom] = useState<LineCustom>(initialCustom);
  const [pathMode, setPathMode] = useState<string>("");
  const [tool, setTool] = useState<string>("pen");
  const device = useGetDevice();

  const clientRect = useClientSize(wrapRef);
  const canvasWidth = clientRect.width;
  const canvasHeight = clientRect.height;

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLineCustom({ ...lineCustom, [id]: value });
  };

  return (
    <div className="fixed top-0 left-0 flex flex-col h-dvh w-full z-10 bg-white">
      <div className="h-[100px] bg-background01 rounded-br-2xl rounded-bl-2xl overflow-hidden">
        <CommonTitle title="그림 그리기" setGoDraw={setGoDraw} />

        {device === "mobile" && <CanvasButtons setPathMode={setPathMode} />}
      </div>

      <div ref={wrapRef} className="w-full flex-1">
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
        />
      </div>

      <div className="relative flex items-center justify-center gap-3 w-full h-[52px] bg-background01">
        <button
          onClick={() => {
            setTool("pen");
          }}
        >
          {tool === "pen" ? (
            <img src={iconOnOff("pen", "on")} alt="펜 on" />
          ) : (
            <img src={iconOnOff("pen", "off")} alt="펜 off" />
          )}
        </button>

        <button
          onClick={() => {
            setTool("eraser");
          }}
        >
          {tool === "eraser" ? (
            <img src={iconOnOff("eraser", "on")} alt="지우개 on" />
          ) : (
            <img src={iconOnOff("eraser", "off")} alt="지우개 off" />
          )}
        </button>

        <button onClick={() => setTool("pallete")}>
          {tool === "pallete" ? (
            <img src={iconOnOff("pallete", "on")} alt="팔레트 on" />
          ) : (
            <img src={iconOnOff("pallete", "off")} alt="팔레트 off" />
          )}
        </button>

        {device === "pc" && <CanvasButtons setPathMode={setPathMode} />}

        {tool === "pen" || tool === "eraser" ? (
          <div className="absolute bottom-full flex items-center gap-4 w-full py-[22px] px-8 rounded-tl-lg rounded-tr-lg overflow-x-auto scrollbar-hide bg-[#404040]">
            <div className="relative w-full h-4 bg-[rgba(255,255,255,0.5)] rounded-[10px]">
              <span
                className={`relative block h-4 bg-[#2BCFF2] transition rounded-l-[10px]`}
                style={{ width: `${((Number(lineCustom.lineWidth) - 1) / 30) * 100}%` }}
              >
                <label
                  htmlFor="lineWidth"
                  className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 w-7 h-7 bg-white rounded-full"
                ></label>
              </span>
              <input
                type="range"
                name="lineWidth"
                id="lineWidth"
                min={1}
                max={30}
                value={lineCustom.lineWidth}
                step={1}
                onChange={(e) => handleChangeCustom(e)}
                className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-7 appearance-none opacity-0"
              />
            </div>
          </div>
        ) : null}

        {tool === "pallete" && (
          <Pallete lineCustom={lineCustom} setLineCustom={setLineCustom} handleChangeCustom={handleChangeCustom} />
        )}
      </div>
    </div>
  );
};
export default Draw;
