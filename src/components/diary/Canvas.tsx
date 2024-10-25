"use client";

import GetRatio from "@/lib/GetRatio";
import { LineCustom } from "@/types/LineCustom";
import { RefObject, useEffect, useRef, useState } from "react";

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
  lineCustom: LineCustom;
  isEraser: boolean;
  getImage: HTMLInputElement;
  pathMode: string;
  setPathMode: React.Dispatch<React.SetStateAction<string>>;
};

const Canvas = ({ canvasWidth, canvasHeight, lineCustom, isEraser, getImage, pathMode, setPathMode }: CanvasProps) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [painting, setPainting] = useState(false);
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [pathStep, setPathStep] = useState<number>(-1);

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
        canvasContext.lineCap = "round";
        canvasContext.globalCompositeOperation = "source-over";

        setCtx(canvasContext);
      }
    };

    setCanvas();

    if (pathHistory.length !== 0 && canvas) {
      const canvasPic = new Image();
      canvasPic.src = pathHistory[pathHistory.length - 1];

      const ratio: number = GetRatio(canvas, canvasPic) as number;

      canvasPic.onload = () =>
        canvasContext?.drawImage(canvasPic, 0, 0, canvasPic.width * ratio, canvasPic.height * ratio);
    }
  }, [canvasWidth, canvasHeight]);

  if (ctx) {
    ctx.lineWidth = Number(lineCustom.lineWidth);
    ctx.strokeStyle = isEraser ? "#ffffff" : lineCustom.lineColor;
  }

  useEffect(() => {
    if (getImage?.files) {
      const file = getImage.files[0];
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.src = url;
      image.onload = () => {
        ctx?.drawImage(image, 0, 0);
        saveHistory();
      };
    }
  }, [getImage]);

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

  const saveHistory = () => {
    if (pathHistory.length > pathStep + 1) {
      setPathHistory([...pathHistory.slice(0, pathStep + 1), canvasRef.current?.toDataURL() as string]);
    } else {
      setPathHistory([...pathHistory, canvasRef.current?.toDataURL() as string]);
    }
    setPathMode("");
    setPathStep(pathStep + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const pathPic = new Image();
      if (pathMode === "undo" && pathStep !== -1) {
        if (pathStep === 0) {
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          pathPic.src = pathHistory[pathStep - 1];
          pathPic.onload = () => {
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            ctx?.drawImage(pathPic, 0, 0, canvas.width, canvas.height);
          };
        }
        setPathMode("");
        setPathStep(pathStep - 1);
      } else if (pathMode === "redo" && pathHistory[pathStep + 1]) {
        pathPic.src = pathHistory[pathStep + 1];
        pathPic.onload = () => {
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(pathPic, 0, 0, canvas.width, canvas.height);
          setPathMode("");
          setPathStep(pathStep + 1);
        };
      }
    }
  }, [pathMode]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={() => setPainting(true)}
      onPointerUp={() => {
        setPainting(false);
        saveHistory();
      }}
      onPointerMove={(e) => drawFn(e)}
      onPointerLeave={() => {
        setPainting(false);
      }}
      className="bg-white"
    />
  );
};
export default Canvas;
