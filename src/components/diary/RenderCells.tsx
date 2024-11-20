"use client";
import getLoginUser from "@/lib/getLoginUser";
import { CellsProps } from "@/types/main/Calendar";
import { format, isSameMonth, isSameDay, addDays } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { useEffect, useState } from "react";

export const RenderCells = ({ currentDate, selectedDate, onDateClick }: CellsProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);
  const today = currentDate.getDate();

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // userId를 가져오는 함수 실행
    const fetchUserId = async () => {
      const data = await getLoginUser();
      if (data) setUserId(data.id);
    };
    fetchUserId();
  }, []);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;

      days.push(
        <div
          className={`flex items-center justify-center w-10 h-10 text-sm leading-normal group ${
            !isSameMonth(day, firstDayOfMonth)
              ? "disabled"
              : isSameDay(day, selectedDate)
              ? "selected"
              : format(currentDate, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }`}
          key={day.toString()}
          onClick={() => onDateClick(cloneDay, userId)}
        >
          <span
            className={`relative flex items-center justify-center w-full h-full rounded-full text-sm leading-normal ${
              String(today) === formattedDate && "bg-white "
            } group-[.selected]:bg-utility03 group-[.selected]:text-white  ${
              format(currentDate, "M") !== format(day, "M") ? "text not-valid text-[#A6A6A6]" : ""
            }`}
          >
            {formattedDate}
          </span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="w-full flex justify-center gap-[6px] cursor-pointer" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return <div className="flex flex-col gap-[2px] mt-[2px]">{rows}</div>;
};
