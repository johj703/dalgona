"use client";

import DrawImage from "@/lib/DrawImage";
import Redo from "@/lib/Redo";
import ReDraw from "@/lib/ReDraw";
import SetCanvasContext from "@/lib/SetCanvasContext";
import Undo from "@/lib/Undo";
import { CanvasProps } from "@/types/Canvas";
import { RefObject, useEffect, useRef, useState } from "react";

const Canvas = ({
  canvasWidth,
  canvasHeight,
  lineCustom,
  isEraser,
  getImage,
  pathMode,
  setPathMode,
  tool,
  fileRef
}: CanvasProps) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [painting, setPainting] = useState(false);
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [pathStep, setPathStep] = useState<number>(-1);
  const [pos, setPos] = useState<number[]>([]);

  // 캔버스 세팅
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    const setCanvas = () => {
      if (canvas && canvasContext) {
        const canvasCtx = SetCanvasContext({ canvas, canvasContext, canvasWidth, canvasHeight });
        setCtx(canvasCtx);
      }
    };

    setCanvas();

    if (pathHistory.length !== 0 && canvas && canvasContext) {
      ReDraw({ pathHistory, canvas, canvasContext });
    }
  }, [canvasWidth, canvasHeight]);

  // 펜 커스텀
  if (ctx) {
    ctx.lineWidth = Number(lineCustom.lineWidth);
    ctx.strokeStyle = isEraser ? "#ffffff" : lineCustom.lineColor;
  }

  // 이미지 업로드
  useEffect(() => {
    if (ctx) {
      DrawImage({ getImage, ctx, saveHistory, fileRef });
    }
  }, [getImage]);

  // undo redo
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && ctx) {
      const pathPic = new Image();
      if (pathMode === "undo" && pathStep !== -1) {
        Undo({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory, saveHistory });
      } else if (pathMode === "redo" && pathHistory[pathStep + 1]) {
        Redo({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory, saveHistory });
      }
    }
  }, [pathMode]);

  // 그리기
  const drawFn = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (tool === "pen") {
      if (!painting) {
        ctx?.beginPath();
        ctx?.moveTo(mouseX, mouseY);
      } else {
        ctx?.lineTo(mouseX, mouseY);
        ctx?.stroke();
      }
    }
  };

  // 사각형 그리기 (보류)
  const drawSquare = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (canvas && ctx && canvasContext && tool === "square") {
      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;

      if (!painting) return;
      ReDraw({ pathHistory, canvas, canvasContext });
      ctx.beginPath();
      ctx.strokeRect(pos[0], pos[1], mouseX - pos[0], mouseY - pos[1]);
    }
  };

  // 히스토리 저장
  const saveHistory = () => {
    if (pathHistory.length > pathStep + 1) {
      setPathHistory([...pathHistory.slice(0, pathStep + 1), canvasRef.current?.toDataURL() as string]);
    } else {
      setPathHistory([...pathHistory, canvasRef.current?.toDataURL() as string]);
    }
    setPathMode("");
    setPathStep(pathStep + 1);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) => {
        setPainting(true);
        setPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
      }}
      onPointerUp={() => {
        setPainting(false);
        saveHistory();
      }}
      onPointerMove={(e) => {
        drawFn(e);
        drawSquare(e);
      }}
      onPointerLeave={() => {
        setPainting(false);
      }}
      className="bg-white"
    />
  );
};
export default Canvas;
