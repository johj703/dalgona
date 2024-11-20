"use client";

import { RefObject, useEffect, useState } from "react";

const useClientSize = (ref: RefObject<HTMLDivElement>) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const setClientSize = () => {
      if (ref.current) {
        setWidth(ref.current.clientWidth);
        setHeight(ref.current.clientHeight);
      }
    };

    setClientSize();

    window.addEventListener("resize", setClientSize);

    return () => {
      window.removeEventListener("resize", setClientSize);
    };
  }, []);

  const clientRects = { width, height };

  return clientRects;
};
export default useClientSize;
