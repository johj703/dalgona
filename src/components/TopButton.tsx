"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const TopButton = () => {
  const [showButton, setShowButton] = useState(false);

  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  useEffect(() => {
    const ShowButtonClick = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", ShowButtonClick);
    return () => {
      window.removeEventListener("scroll", ShowButtonClick);
    };
  }, []);

  return (
    <>
      {showButton && (
        <div className="flex w-[56px] h-[56px] p-[16px] items-center gap-[10px] fixed z-50 right-[4px] bottom-[61px] rounded-full bg-[#E89080] ">
          <div className="flex w-[24px] h-[24px] justify-center items-center gap-[24px] shrink-0">
            <Image
              src="/icons/arrow-top.svg"
              width={12}
              height={12}
              alt="arrow-top"
              onClick={handleTop}
              className="shrink-0"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TopButton;

//
