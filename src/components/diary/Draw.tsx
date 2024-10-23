"use client";

import { RefObject, useRef } from "react";
import Canvas from "./Canvas";
import useClientSize from "@/hooks/useClientSize";

const Draw = () => {
  const wrapRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const clientRect = useClientSize(wrapRef);
  const canvasWidth = clientRect.width;
  const canvasHeight = clientRect.height;

  return (
    <div ref={wrapRef} className="w-full h-dvh">
      <Canvas canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
    </div>
  );
};
export default Draw;
