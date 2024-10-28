import React, { useState } from "react";
import { DateDropdownProps } from "@/types/library/Diary";

const DateDropdown: React.FC<DateDropdownProps> = ({ month, day, setMonth, setDay }) => {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const toggleMonthDropdown = () => {
    setIsMonthOpen(!isMonthOpen);
    if (isDayOpen) setIsDayOpen(false);
  };

  const toggleDayDropdown = () => {
    setIsDayOpen(!isDayOpen);
    if (isMonthOpen) setIsMonthOpen(false);
  };

  return (
    <div className="flex mb-4">
      <div className="relative">
        <div className="flex items-center pt-4 pl-4">
          <span className="text-lg font-normal">{month}월</span>
          <button
            onClick={toggleMonthDropdown}
            className="ml-1 py-1 text-sm rounded focus:outline-none"
            aria-expanded={isMonthOpen}
          >
            ▼
          </button>
        </div>
        {isMonthOpen && (
          <ul className="absolute z-10 rounded border ml-4 bg-white max-h-40 overflow-y-auto">
            {months.map((m) => (
              <li
                key={m}
                onClick={() => {
                  setMonth(m);
                  setIsMonthOpen(false);
                }}
                className="cursor-pointer py-2 text-sm hover:bg-gray-200"
              >
                {m}월
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative ml-2">
        <div className="flex items-center pt-4 pl-4">
          <span className="text-lg font-normal">{day === 0 ? "선택" : `${day}일`}</span>
          <button
            onClick={toggleDayDropdown}
            className="ml-1 py-1 text-sm rounded focus:outline-none"
            aria-expanded={isDayOpen}
          >
            ▼
          </button>
        </div>
        {isDayOpen && (
          <ul className="absolute z-10 rounded border ml-4 bg-white max-h-40 overflow-y-auto">
            {days.map((d) => (
              <li
                key={d}
                onClick={() => {
                  setDay(d);
                  setIsDayOpen(false);
                }}
                className="cursor-pointer py-2 text-sm hover:bg-gray-200"
              >
                {d}일
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DateDropdown;