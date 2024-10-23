"use client";

import { RefObject, useEffect, useRef, useState } from "react";

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
};
const Canvas = ({ canvasWidth, canvasHeight }: CanvasProps) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [painting, setPainting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    const setCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio ?? 1;

      if (canvas && canvasContext) {
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";

        canvas.width = canvasWidth * devicePixelRatio;
        canvas.height = canvasHeight * devicePixelRatio;

        canvasContext.scale(devicePixelRatio, devicePixelRatio);

        canvasContext.lineJoin = "round";
        canvasContext.lineWidth = 2.5;
        canvasContext.strokeStyle = "#ffffff";
        setCtx(canvasContext);
      }
    };

    setCanvas();
  }, [canvasWidth, canvasHeight]);

  const drawFn = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (!painting) {
      ctx?.beginPath();
      ctx?.moveTo(mouseX, mouseY);
    } else {
      ctx?.lineTo(mouseX, mouseY);
      ctx?.stroke();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={() => setPainting(true)}
      onMouseUp={() => setPainting(false)}
      onMouseMove={(e) => drawFn(e)}
      onMouseLeave={() => setPainting(false)}
    />
  );
};
export default Canvas;
