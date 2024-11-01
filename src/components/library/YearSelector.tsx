import React, { useEffect, useRef, useState } from "react";
import { YearSelectorProps } from "@/types/library/YearSelector";

const YearSelector: React.FC<YearSelectorProps> = ({ currentYear, selectedYear, onYearChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 연도를 포함하여 과거 10년 범위로 배열 생성
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleYearChange = (year: number) => {
    onYearChange(year);
    setIsOpen(false); // 연도를 선택하면 드롭다운 닫기
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 여백 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="h-9 inline-flex items-center justify-center p-2.5 gap-2.5 border border-black rounded-lg cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="text-xs font-normal font-['Pretendard'] leading-[18px]">{selectedYear}년</span>
        <img src={isOpen ? "/icons/arrow-up(W).svg" : "/icons/arrow-down.svg"} alt="Arrow Icon" className="relative" />
      </div>

      {isOpen && (
        <ul
          id="year-list"
          role="listbox"
          className="absolute z-10 mt-1 w-32 rounded-lg border border-gray-300 bg-white shadow-lg"
        >
          {years.map((year) => (
            <li
              key={year}
              onClick={() => handleYearChange(year)}
              role="option"
              aria-selected={year === selectedYear}
              className={`cursor-pointer px-4 py-2 text-sm text-black hover:bg-gray-200 ${
                year === selectedYear ? "bg-gray-300 font-bold" : ""
              }`}
            >
              {year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YearSelector;
