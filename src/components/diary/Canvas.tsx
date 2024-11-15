"use client";

import getRatio from "@/lib/diary/getRatio";
//import { convertHexToRgba, floodFill } from "@/lib/paint";
import redo from "@/lib/diary/redo";
import reDraw from "@/lib/diary/reDraw";
import setCanvasContext from "@/lib/diary/setCanvasContext";
import undo from "@/lib/diary/undo";
import { CanvasProps } from "@/types/Canvas";
import browserClient from "@/utils/supabase/client";
import { decode } from "base64-arraybuffer";
import { RefObject, useEffect, useRef, useState } from "react";
import Modal from "../Modal";

const newDate = new Date().toISOString();
const Canvas = ({
  canvasWidth,
  canvasHeight,
  lineCustom,
  pathMode,
  setPathMode,
  tool,
  setTool,
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
  const [openClose, setOpenClose] = useState<boolean>(false);

  // 캔버스 세팅
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    const setCanvas = () => {
      if (canvas && canvasContext) {
        const canvasCtx = setCanvasContext({ canvas, canvasContext, canvasWidth, canvasHeight });
        setCtx(canvasCtx);
      }
    };

    setCanvas();

    if (pathHistory.length === 0 && ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    if (pathHistory.length !== 0 && canvas && canvasContext) {
      reDraw({ pathHistory, canvas, canvasContext, pathStep });
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

        const ratio: number = getRatio(canvas, pathPic) as number;
        canvasContext.drawImage(pathPic, 0, 0, pathPic.width * ratio, pathPic.height * ratio);
        saveHistory();
      };
    }
  }, [goDraw]);

  // 펜 커스텀
  if (ctx) {
    ctx.lineWidth = Number(lineCustom.lineWidth);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : lineCustom.lineColor;
  }

  // undo redo reset
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && ctx) {
      const pathPic = new Image();
      if (pathMode === "undo" && pathStep !== -1) {
        undo({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory, saveHistory });
      } else if (pathMode === "redo" && pathHistory[pathStep + 1]) {
        redo({ pathStep, ctx, canvas, pathPic, setPathMode, setPathStep, pathHistory, saveHistory });
      } else if (pathMode === "save") {
        const uploadImage = async () => {
          if (canvasRef.current) {
            const imageDataUrl = canvasRef.current.toDataURL("image/png"); // Canvas에서 이미지 데이터 가져오기
            const base64FileData = imageDataUrl.split(",")[1]; // Base64 데이터 추출

            const { data, error } = await browserClient.storage
              .from("posts")
              .upload(`drawing/${POST_ID}-${newDate}`, decode(base64FileData), {
                contentType: "image/png",
                upsert: true
              });

            if (error) console.error("error messgage =>", error);
            if (data) {
              const { data } = browserClient.storage.from("posts").getPublicUrl(`drawing/${POST_ID}-${newDate}`);

              setFormData({ ...formData, draw: `${data.publicUrl}?version=${crypto.randomUUID()}` });

              setGoDraw(false);
            }
          }
        };
        uploadImage();
      } else if (pathMode === "reset") {
        setOpenClose(true);
      }
    }
  }, [pathMode]);

  const resetCanvas = async () => {
    const canvas = canvasRef.current;

    if (canvas && ctx) {
      ctx.reset();
      const canvasCtx = setCanvasContext({ canvas, canvasContext: ctx, canvasWidth, canvasHeight });
      setCtx(canvasCtx);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      setPathHistory([]);
      setPathStep(-1);
    }
  };

  // 그리기
  const drawFn = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (tool === "pen" || tool === "eraser") {
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
    <>
      <canvas
        ref={canvasRef}
        onPointerDown={() => {
          setPainting(true);
        }}
        onPointerUp={() => {
          if (tool === "pallete") {
            setTool("pen");
          }

          setPainting(false);
          saveHistory();
        }}
        onPointerMove={(e) => {
          drawFn(e);
        }}
        onPointerLeave={() => {
          setPainting(false);
        }}
        className="bg-white touch-none"
      />

      {openClose && (
        <Modal
          mainText="작업중인 그림을 초기화하시겠습니까?"
          subText="초기화 후에는 복구할 수 없습니다."
          setModalState={setOpenClose}
          isConfirm={true}
          confirmAction={resetCanvas}
        />
      )}
    </>
  );
};
export default Canvas;
