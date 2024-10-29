import { HeaderProps } from "@/types/main/Calendar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { format } from "date-fns";
import React from "react";

const RenderHeader = ({ currentDate, prevMonth, nextMonth }: HeaderProps) => {
  return (
    <div>
      <div className="flex justify-between">
        <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
        <h2>
          {format(currentDate, "yyyy")} . {format(currentDate, "M")}
        </h2>
        <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
      </div>
    </div>
  );
};

export default RenderHeader;
