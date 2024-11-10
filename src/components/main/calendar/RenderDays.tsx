import React from "react";

const RenderDays = () => {
  const DAY_LIST: string[] = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="flex justify-center items-center gap-[6px] w-[325px]">
      {DAY_LIST.map((day, index) => {
        return (
          <div
            key={`${index}day`}
            className="flex flex-col items-center justify-center w-[40px] h-[40px] shrink-0 text-[#737373] text-[14px] font-[400] leading-normal"
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default RenderDays;
