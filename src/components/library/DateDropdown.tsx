import React, { useState, useEffect, useRef } from "react";
import { DateDropdownProps } from "@/types/library/Diary";

const DateDropdown: React.FC<DateDropdownProps> = ({ year, month, day, setYear, setMonth, setDay }) => {
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  const toggleYearDropdown = () => {
    setIsYearOpen(!isYearOpen);
    if (isMonthOpen) setIsMonthOpen(false);
    if (isDayOpen) setIsDayOpen(false);
  };

  const toggleMonthDropdown = () => {
    setIsMonthOpen(!isMonthOpen);
    if (isYearOpen) setIsYearOpen(false);
    if (isDayOpen) setIsDayOpen(false);
  };

  const toggleDayDropdown = () => {
    setIsDayOpen(!isDayOpen);
    if (isYearOpen) setIsYearOpen(false);
    if (isMonthOpen) setIsMonthOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        yearRef.current &&
        !yearRef.current.contains(event.target as Node) &&
        monthRef.current &&
        !monthRef.current.contains(event.target as Node) &&
        dayRef.current &&
        !dayRef.current.contains(event.target as Node)
      ) {
        setIsYearOpen(false);
        setIsMonthOpen(false);
        setIsDayOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex gap-3 mt-4">
      {/* Year Dropdown */}
      <div className="flex-1 lg:flex-none" ref={yearRef}>
        <div className="flex items-center">
          <div className="relative flex justify-between items-center inline-flex gap-1 rounded-lg bg-white border border-[#BFBFBF] w-full h-9 px-3 lg:w-[75px]">
            <span className="text-xs font-normal">{year}</span>
            <button
              onClick={toggleYearDropdown}
              className="ml-1 py-1 text-sm rounded focus:outline-none"
              aria-expanded={isYearOpen}
            >
              <img src={isYearOpen ? "/icons/arrow-up(B).svg" : "/icons/arrow-down.svg"} alt="arrow-icon" />
            </button>
            {isYearOpen && (
              <ul className="absolute z-10 rounded-lg border border-[#BFBFBF] bg-white max-h-40 w-full left-0 top-full mt-[10px] overflow-y-auto">
                {years.map((y, index) => (
                  <li
                    key={y}
                    onClick={() => {
                      setYear(y);
                      setIsYearOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm text-black ${
                      index < years.length - 1 ? "border-b border-[#8C8C8C]" : ""
                    }`}
                  >
                    {y}년
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="ml-2 mt-5 text-xs font-normal">년</p>
        </div>
      </div>

      {/* Month Dropdown */}
      <div className="flex-1 lg:flex-none" ref={monthRef}>
        <div className="flex items-center">
          <div className="relative flex justify-between items-center inline-flex gap-1 rounded-lg bg-white border border-[#BFBFBF] w-full h-9 px-3 lg:w-[75px]">
            <span className="text-xs font-normal">{month}</span>
            <button
              onClick={toggleMonthDropdown}
              className="ml-1 py-1 text-sm rounded focus:outline-none"
              aria-expanded={isMonthOpen}
            >
              <img src={isMonthOpen ? "/icons/arrow-up(B).svg" : "/icons/arrow-down.svg"} alt="arrow-icon" />
            </button>
            {isMonthOpen && (
              <ul className="absolute z-10 rounded-lg border border-[#BFBFBF] bg-white max-h-40 w-full left-0 top-full mt-[10px] overflow-y-auto">
                {months.map((m, index) => (
                  <li
                    key={m}
                    onClick={() => {
                      setMonth(m);
                      setIsMonthOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm text-black ${
                      index < months.length - 1 ? "border-b border-[#8C8C8C]" : ""
                    }`}
                  >
                    {m}월
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="ml-2 mt-5 text-xs font-normal">월</p>
        </div>
      </div>

      {/* Day Dropdown */}
      <div className="flex-1 lg:flex-none" ref={dayRef}>
        <div className="flex items-center">
          <div className="relative flex justify-between items-center inline-flex gap-1 rounded-lg bg-white border border-[#BFBFBF] w-full h-9 px-3 lg:w-[75px]">
            <span className="text-xs font-normal">{day === 0 ? "선택" : `${day}일`}</span>
            <button
              onClick={toggleDayDropdown}
              className="ml-1 py-1 text-sm rounded focus:outline-none"
              aria-expanded={isDayOpen}
            >
              <img src={isDayOpen ? "/icons/arrow-up(B).svg" : "/icons/arrow-down.svg"} alt="arrow-icon" />
            </button>
            {isDayOpen && (
              <ul className="absolute z-10 rounded-lg border border-[#BFBFBF] bg-white max-h-40 w-full left-0 top-full mt-[10px] overflow-y-auto">
                {days.map((d, index) => (
                  <li
                    key={d}
                    onClick={() => {
                      setDay(d);
                      setIsDayOpen(false);
                    }}
                    className={`cursor-pointer px-4 py-2 text-sm text-black ${
                      index < days.length - 1 ? "border-b border-[#8C8C8C]" : ""
                    }`}
                  >
                    {d}일
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="ml-2 mt-5 text-xs font-normal">일</p>
        </div>
      </div>
    </div>
  );
};

export default DateDropdown;
