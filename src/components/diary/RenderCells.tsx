import { CellsProps } from "@/types/main/Calendar";
import { format, isSameMonth, isSameDay, addDays } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

export const RenderCells = ({ currentDate, selectedDate, onDateClick }: CellsProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);

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
          onClick={() => onDateClick(cloneDay)}
        >
          <span
            className={`relative text-sm leading-normal content-none before:content-none group-[.selected]:before:content-[''] before:w-[30px] before:h-[2px] before:bg-[#D84E35] before:absolute before:left-1/2 before:bottom-0 before:-translate-x-1/2 ${
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
