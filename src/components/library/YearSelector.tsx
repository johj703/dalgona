import React, { useEffect, useRef, useState } from "react";
import { YearSelectorProps } from "@/types/library/YearSelector";

const YearSelector: React.FC<YearSelectorProps> = ({ currentYear, selectedYear, onYearChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 연도를 포함하여 10년 범위로 배열 생성
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleYearChange = (year: number) => {
    onYearChange(year);
    setIsOpen(false); // 연도를 선택하면 드롭다운 닫기
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsClicked(!isClicked);
  };

  // 여백 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsClicked(false); // 드롭다운을 닫으면 스타일 초기화
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative ">
      <div
        className="relative flex justify-between items-center inline-flex gap-1 rounded-lg bg-white border border-[#BFBFBF] h-9 px-3 lg:mx-[250px]"
        onClick={toggleDropdown}
      >
        <span className="text-xs font-normal leading-[18px]">{selectedYear}년</span>
        <img src={isOpen ? "/icons/arrow-up(B).svg" : "/icons/arrow-down.svg"} alt="Arrow Icon" className="relative" />

        {isOpen && (
          <ul
            id="year-list"
            role="listbox"
            className="absolute z-10 rounded-lg border border-[#BFBFBF] bg-white max-h-40 w-full left-0 top-full mt-[10px] overflow-y-auto"
          >
            {years.map((year, index) => (
              <li
                key={year}
                onClick={() => handleYearChange(year)}
                role="option"
                aria-selected={year === selectedYear}
                className={`cursor-pointer px-4 py-2 text-sm text-black ${
                  index < years.length - 1 ? "border-b border-[#8C8C8C]" : ""
                }`}
              >
                {year}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default YearSelector;
