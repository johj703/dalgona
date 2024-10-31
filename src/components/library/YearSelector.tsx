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
      <div className="flex items-center pt-4 pl-4">
        <span className="text-lg font-normal">{selectedYear}년</span>
        <button
          onClick={toggleDropdown}
          className="ml-1 py-1 text-sm rounded focus:outline-none"
          aria-expanded={isOpen}
          aria-controls="year-list"
        >
          ▼
        </button>
      </div>

      {isOpen && (
        <ul id="year-list" role="listbox" className="absolute z-10 rounded border ml-4">
          {years.map((year) => (
            <li
              key={year}
              onClick={() => handleYearChange(year)}
              role="option"
              aria-selected={year === selectedYear}
              className={`cursor-pointer px-4 py-2 text-sm bg-white text-black hover:bg-gray-200 ${
                year === selectedYear ? "font-bold" : ""
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
