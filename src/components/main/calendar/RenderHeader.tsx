import { HeaderProps } from "@/types/main/Calendar";
import { format } from "date-fns";
import React from "react";

const RenderHeader = ({ currentDate, prevMonth, nextMonth }: HeaderProps) => {
  return (
    <div className="flex justify-between w-[100%]">
      <img
        src="/icons/keyboard-arrow-left.svg"
        width={24}
        height={24}
        alt="keyboard-arrow-left"
        onClick={prevMonth}
        className="p-[2px] border-[1px] border-black bg-white rounded-lg"
      />
      <h2 className="font-['Pretendard-Regular'] text-[14px] font-[500] not-italic leading-[21px]">
        {format(currentDate, "yyyy")} . {format(currentDate, "M")}
      </h2>
      <img
        src="/icons/keyboard-arrow-right.svg"
        width={24}
        height={24}
        alt="keyboard-arrow-right"
        onClick={nextMonth}
        className="p-[2px] border-[1px] border-black bg-white rounded-lg"
      />
    </div>
  );
};

export default RenderHeader;
