import { HeaderProps } from "@/types/main/Calendar";
import { format } from "date-fns";
import React from "react";

const RenderHeader = ({ currentDate, prevMonth, nextMonth }: HeaderProps) => {
  return (
    <div>
      <div className="flex justify-between ">
        <img src="/icons/calendar-prev.svg" alt="이전 달로" onClick={prevMonth} />
        <h2 className="text-sm">
          {format(currentDate, "yyyy")} . {format(currentDate, "M")}
        </h2>
        <img src="/icons/calendar-next.svg" alt="다음 달로" onClick={nextMonth} />
      </div>
    </div>
  );
};

export default RenderHeader;
