"use client";

import { RefObject, useRef, useState } from "react";
import Canvas from "./Canvas";
import useClientSize from "@/hooks/useClientSize";
import { LineCustom } from "@/types/LineCustom";

const initialCustom = {
  lineWidth: "4",
  lineColor: "#212121"
};

const Draw = () => {
  const wrapRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [lineCustom, setLineCustom] = useState<LineCustom>(initialCustom);
  const [getImage, setGetImage] = useState<FileList | null>(null);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [pathMode, setPathMode] = useState<string>("");
  const [tool, setTool] = useState<string>("pen");
  const [showPallete, setShowPallete] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const clientRect = useClientSize(wrapRef);
  const canvasWidth = clientRect.width;
  const canvasHeight = clientRect.height;

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLineCustom({ ...lineCustom, [id]: value });
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10">
        <button onClick={() => setPathMode("save")}>save</button>
        <button onClick={() => setPathMode("undo")}>undo</button>
        <button onClick={() => setPathMode("redo")}>redo</button>
      </div>
      <div ref={wrapRef} className="w-full h-dvh">
        <Canvas
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          lineCustom={lineCustom}
          isEraser={isEraser}
          getImage={getImage}
          pathMode={pathMode}
          setPathMode={setPathMode}
          tool={tool}
          fileRef={fileRef.current}
        />
      </div>
      <div className="fixed bottom-0 left-0 w-full z-10">
        <button onClick={() => setShowPallete(true)}>컬러팔레트</button>
        <button
          onClick={() => {
            setTool("pen");
            setIsEraser(false);
          }}
        >
          펜
        </button>

        <button
          onClick={() => {
            setIsEraser(true);
            setTool("pen");
          }}
        >
          지우개
        </button>

        {/* <button onClick={() => setTool("paint")}>채우기</button> */}
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
          />
        )}
        {showPallete && (
          <div>
            <div className="w-5 h-5 bg-red-600" onClick={() => setLineCustom({ ...lineCustom, lineColor: "#dc2626" })}>
              red
            </div>

            <input
              type="color"
              name="lineColor"
              id="lineColor"
              value={lineCustom.lineColor}
              onChange={(e) => {
                handleChangeCustom(e);
                setIsEraser(false);
              }}
            />
          </div>
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
            console.log(e.target.files);
            setGetImage(e.target.files);
          }}
        />
      </div>
    </>
  );
};
export default Draw;
