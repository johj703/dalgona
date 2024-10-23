import React, { useEffect, useRef, useState } from "react";
import { YearSelectorProps } from "@/types/YearSelector";

const YearSelector: React.FC<YearSelectorProps> = ({ currentYear, onYearChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // 드롭다운을 열 때마다 항상 현재 연도부터 과거 연도로 배열 생성 10년까지!
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    onYearChange(year);
    setIsOpen(false); // 연도를 선택하면 드롭다운 닫기
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // 드롭다운을 열 때 selectedYear를 currentYear로 설정
    if (!isOpen) {
      setSelectedYear(selectedYear);
    }
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
    <div ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <span>{selectedYear}년</span>
        <button onClick={toggleDropdown} aria-expanded={isOpen} aria-controls="year-list">
          ▼
        </button>
      </div>

      {isOpen && (
        <ul id="year-list" role="listbox">
          {years.map((year) => (
            <li key={year} onClick={() => handleYearChange(year)} role="option" aria-selected={year === selectedYear}>
              {year}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default YearSelector;
