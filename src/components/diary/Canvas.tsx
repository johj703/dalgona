"use client";

import DrawImage from "@/lib/DrawImage";
import GetRatio from "@/lib/GetRatio";
import { convertHexToRgba, floodFill } from "@/lib/Paint";
import Redo from "@/lib/Redo";
import ReDraw from "@/lib/ReDraw";
import SetCanvasContext from "@/lib/SetCanvasContext";
import Undo from "@/lib/Undo";
import { CanvasProps } from "@/types/Canvas";
import browserClient from "@/utils/supabase/client";
import { decode } from "base64-arraybuffer";
import { toast } from "garlic-toast";
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
  fileRef,
  setFormData,
  formData,
  setGoDraw,
  goDraw,
  POST_ID
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");
    if (formData.draw && canvasContext && canvas) {
      const pathPic = new Image();
      pathPic.crossOrigin = "anonymous";
      pathPic.src = formData.draw;
      pathPic.onload = () => {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        const ratio: number = GetRatio(canvas, pathPic) as number;
        canvasContext.drawImage(pathPic, 0, 0, pathPic.width * ratio, pathPic.height * ratio);
        saveHistory();
      };
    }
  }, [goDraw]);

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

  // undo redo reset
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && ctx) {
      const pathPic = new Image();
      if (pathMode === "undo" && pathStep !== -1) {
        Undo({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory, saveHistory });
      } else if (pathMode === "redo" && pathHistory[pathStep + 1]) {
        Redo({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory, saveHistory });
      } else if (pathMode === "save") {
        const uploadImage = async () => {
          if (canvasRef.current) {
            const imageDataUrl = canvasRef.current.toDataURL("image/png"); // Canvas에서 이미지 데이터 가져오기
            const base64FileData = imageDataUrl.split(",")[1]; // Base64 데이터 추출

            const { data, error } = await browserClient.storage
              .from("posts")
              .upload(`drawing/${POST_ID}`, decode(base64FileData), {
                contentType: "image/png",
                upsert: true
              });

            if (error) console.error("error messgage =>", error);
            if (data) {
              const { data } = browserClient.storage.from("posts").getPublicUrl(`drawing/${POST_ID}`);

              setFormData({ ...formData, draw: `${data.publicUrl}?version=${crypto.randomUUID()}` });

              setGoDraw(false);
            }
          }
        };
        uploadImage();
      } else if (pathMode === "reset") {
        toast
          .confirm("정말 초기화하시겠습니까?", {
            confirmBtn: "확인",
            cancleBtn: "취소",
            confirmBtnColor: "#0000ff",
            cancleBtnColor: "#ff0000"
          })
          .then(async (isConfirm) => {
            if (isConfirm) {
              ctx.reset();
              const canvasCtx = SetCanvasContext({ canvas, canvasContext: ctx, canvasWidth, canvasHeight });
              setCtx(canvasCtx);
              setPathHistory([]);
              setPathStep(-1);
            }
          });
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
  useEffect(() => {
    if (!painting) {
      ctx?.closePath();
      ctx?.beginPath();
    }
  }, [painting]);

  // 사각형 그리기 (보류)
  const drawSquare = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    if (canvas && ctx && canvasContext && tool === "square") {
      const mouseX = e.nativeEvent.offsetX;
      const mouseY = e.nativeEvent.offsetY;

      if (!painting) return;
      ReDraw({ pathHistory, canvas, canvasContext, pathStep });
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

  const paintCanvas = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const curPos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    if (!curPos) return;
    const currentColor = convertHexToRgba(lineCustom.lineColor);
    floodFill(curPos.x, curPos.y, currentColor, ctx);
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={(e) => {
        if (tool === "paint") {
          paintCanvas(e);
        } else {
          setPainting(true);
          setPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
        }
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
      className="bg-white touch-none"
    />
  );
};
export default Canvas;
