import React from "react";

const RenderDays = () => {
  const DAY_LIST: string[] = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="w-full flex justify-center  gap-[6px]">
      {DAY_LIST.map((day, index) => {
        return (
          <div
            key={`${index}day`}
            className="flex items-center justify-center w-10 h-10 text-sm leading-normal text-[#737373]"
          >
            {day}
          </div>
        );
      })}
    </div>
  );
};

export default RenderDays;
