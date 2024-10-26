"use client";

import DrawImage from "@/lib/DrawImage";
import { convertHexToRgba, getPixelColor, isSameColor, setPixel } from "@/lib/Paint";
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
      ReDraw({ pathHistory, canvas, canvasContext, pathStep });
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

  const floodFill = (x: number, y: number, fillColor: Uint8ClampedArray) => {
    const imageData = ctx?.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (imageData) {
      const visited = new Uint8Array(imageData.width * imageData.height);
      const targetColor = getPixelColor(imageData, x, y);

      if (!isSameColor(targetColor, fillColor)) {
        const stack = [{ x, y }];
        while (stack.length > 0) {
          const child = stack.pop();
          if (!child) return;
          const currentColor = getPixelColor(imageData, child.x, child.y);
          if (!visited[child.y * imageData.width + child.x] && isSameColor(currentColor, targetColor)) {
            setPixel(imageData, child.x, child.y, fillColor);
            visited[child.y * imageData.width + child.x] = 1;
            stack.push({ x: child.x + 1, y: child.y });
            stack.push({ x: child.x - 1, y: child.y });
            stack.push({ x: child.x, y: child.y + 1 });
            stack.push({ x: child.x, y: child.y - 1 });
          }
        }
        ctx?.putImageData(imageData, 0, 0);
      }
    }
  };

  const paintCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const curPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    if (!curPos) return;
    const currentColor = convertHexToRgba(lineCustom.lineColor);
    floodFill(curPos.x, curPos.y, currentColor);
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
      onClick={(e) => {
        if (tool === "paint") {
          paintCanvas(e);
        }
      }}
      className="bg-white"
    />
  );
};
export default Canvas;
