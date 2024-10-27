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
  const fileRef = useRef<HTMLInputElement>(null);

  const clientRect = useClientSize(wrapRef);
  const canvasWidth = clientRect.width;
  const canvasHeight = clientRect.height;

  const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLineCustom({ ...lineCustom, [id]: value });
  };

  const handleClickUndo = () => {
    setPathMode("undo");
  };
  const handleClickRedo = () => {
    setPathMode("redo");
  };

  return (
    <>
      <div>
        <button onClick={() => handleClickUndo()}>undo</button>
        <button onClick={() => handleClickRedo()}>redo</button>
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
      <div>
        <div>
          <button
            onClick={() => {
              setTool("pen");
              setIsEraser(false);
            }}
          >
            펜
          </button>
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

        <button onClick={() => setTool("paint")}>페인트</button>

        {/* 네모 그리기 보류 */}
        {/* <div>
          <div onClick={() => setTool("square")}>네모</div>
        </div> */}

        <div
          className=""
          onClick={() => {
            setIsEraser(true);
            setTool("pen");
          }}
        >
          지우개
        </div>

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
