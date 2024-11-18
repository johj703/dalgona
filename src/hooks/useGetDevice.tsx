import { useEffect, useState } from "react";

const useGetDevice = () => {
  const [browserWidth, setBrowserWidth] = useState<number>(1024);

  const getWidth = () => {
    setBrowserWidth(window.innerWidth);
  };
  useEffect(() => {
    getWidth();
    window.addEventListener("resize", getWidth);

    return () => {
      window.removeEventListener("resize", getWidth);
    };
  }, []);

  return browserWidth! >= 1024 ? "pc" : "mobile";
};
export default useGetDevice;
