"use client";

import { RefObject, useRef, useState } from "react";
import Canvas from "./Canvas";
import useClientSize from "@/hooks/useClientSize";
import { LineCustom } from "@/types/LineCustom";
import { DrawProps } from "@/types/Canvas";
import Pallete from "./Pallete";

const initialCustom = {
  lineWidth: "7",
  lineColor: "#000000"
};

const Draw = ({ POST_ID, setFormData, formData, setGoDraw, goDraw }: DrawProps) => {
  const wrapRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [lineCustom, setLineCustom] = useState<LineCustom>(initialCustom);
  const [getImage, setGetImage] = useState<FileList | null>(null);
  const [pathMode, setPathMode] = useState<string>("");
  const [tool, setTool] = useState<string>("pen");
  const fileRef = useRef<HTMLInputElement>(null);

  const clientRect = useClientSize(wrapRef);
  const canvasWidth = clientRect.width;
  const canvasHeight = clientRect.height;

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLineCustom({ ...lineCustom, [id]: value });
  };

  return (
    <div className="fixed top-0 left-0 flex flex-col h-screen w-full z-10 bg-white">
      <div className="h-[100px] bg-background01 rounded-br-2xl rounded-bl-2xl overflow-hidden">
        <div className="flex items-center justify-between text-base py-1 px-4">
          <div onClick={() => setGoDraw(false)} className="flex items-center w-11 h-11">
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
          getImage={getImage}
          pathMode={pathMode}
          setPathMode={setPathMode}
          tool={tool}
          fileRef={fileRef.current}
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
          {tool === "pen" ? <img src="/icons/pen-on.svg" alt="펜 on" /> : <img src="/icons/pen-off.svg" alt="펜 off" />}
        </button>

        <button
          onClick={() => {
            setTool("eraser");
          }}
        >
          {tool === "eraser" ? (
            <img src="/icons/eraser-on.svg" alt="지우개 on" />
          ) : (
            <img src="/icons/eraser-off.svg" alt="지우개 off" />
          )}
        </button>

        <button onClick={() => setTool("paint")}>채우기</button>

        <button onClick={() => setTool("pallete")}>
          {tool === "pallete" ? (
            <img src="/icons/pallete-on.svg" alt="팔레트 on" />
          ) : (
            <img src="/icons/pallete-off.svg" alt="팔레트 off" />
          )}
        </button>

        {tool === "pen" && (
          <input
            type="range"
            name="lineWidth"
            id="lineWidth"
            min={1}
            max={20}
            value={lineCustom.lineWidth}
            step={1}
            onChange={(e) => handleChangeCustom(e)}
            className="hidden"
          />
        )}
        {tool === "pallete" && (
          <Pallete lineCustom={lineCustom} setLineCustom={setLineCustom} handleChangeCustom={handleChangeCustom} />
        )}

        {/* 네모 그리기 보류 */}
        {/* <div>
          <div onClick={() => setTool("square")}>네모</div>
        </div> */}

        <input
          type="file"
          name="uploadImage"
          id="uploadImage"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => {
            setGetImage(e.target.files);
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};
export default Draw;
