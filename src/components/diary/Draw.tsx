"use client";

import { RefObject, useRef, useState } from "react";
import Canvas from "./Canvas";
import useClientSize from "@/hooks/useClientSize";
import { LineCustom } from "@/types/LineCustom";
import { DrawProps } from "@/types/Canvas";
import Pallete from "./Pallete";
import { iconOnOff } from "@/utils/diary/iconOnOff";

const initialCustom = {
  lineWidth: "7",
  lineColor: "#000000"
};

const Draw = ({ POST_ID, setFormData, formData, setGoDraw, goDraw }: DrawProps) => {
  const wrapRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [lineCustom, setLineCustom] = useState<LineCustom>(initialCustom);
  const [pathMode, setPathMode] = useState<string>("");
  const [tool, setTool] = useState<string>("pen");

  const clientRect = useClientSize(wrapRef);
  const canvasWidth = clientRect.width;
  const canvasHeight = clientRect.height;

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLineCustom({ ...lineCustom, [id]: value });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-auto z-50 bg-background02">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-full h-full max-w-[414px] max-h-[896px]  z-10 bg-white">
        <div className="h-[100px] bg-background01 rounded-br-2xl rounded-bl-2xl">
          <div className="flex items-center justify-between text-base py-1 px-4">
            <div onClick={() => setGoDraw(false)} className="flex items-center w-11 h-11 cursor-pointer">
              <img src="/icons/close-small.svg" alt="닫기" />
            </div>
            그림 그리기
            <span className="w-11 h-11"></span>
          </div>
          <div className="flex gap-2">
            <button className="mr-auto" onClick={() => setPathMode("save")}>
              <img src="/icons/save.svg" alt="저장" />
            </button>

            <button onClick={() => setPathMode("reset")}>
              <img src="/icons/reset.svg" alt="reset" />
            </button>
            <button onClick={() => setPathMode("undo")}>
              <img src="/icons/undo.svg" alt="undo" />
            </button>
            <button onClick={() => setPathMode("redo")}>
              <img src="/icons/redo.svg" alt="redo" />
            </button>
          </div>
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

          {tool === "pen" || tool === "eraser" ? (
            <div className="absolute bottom-full flex items-center gap-4 w-full py-[22px] px-8 rounded-tl-lg rounded-tr-lg overflow-x-auto bg-[#404040]">
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
    </div>
  );
};
export default Draw;
