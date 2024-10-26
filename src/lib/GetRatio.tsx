type GetSize = {
  canvasSize: number;
  canvasPicSize: number;
};

const GetRatio = (canvas: HTMLCanvasElement, canvasPic: HTMLImageElement) => {
  const calRatio = ({ canvasSize, canvasPicSize }: GetSize) => {
    const calRatio = canvasSize / canvasPicSize;
    return calRatio;
  };

  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;
  const picWidth = canvasPic.width;
  const picHeight = canvasPic.height;

  if (canvasWidth < picWidth) {
    return calRatio({ canvasSize: canvasWidth, canvasPicSize: picWidth });
  } else if (canvasHeight < picHeight) {
    return calRatio({ canvasSize: canvasHeight, canvasPicSize: picHeight });
  }

  return 1;
};
export default GetRatio;
