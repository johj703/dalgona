import React, { useState, useEffect, useRef } from "react";

interface SortDropdownProps {
  currentSort: "newest" | "oldest";
  onSortChange: (sort: "newest" | "oldest") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부를 클릭했을 때 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 마우스 클릭 이벤트 리스너 추가
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSortChange = (value: "newest" | "oldest") => {
    onSortChange(value);
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  return (
    <div className="relative mt-[10px] flex justify-end lg:mb-1" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="pt-[10px] flex items-center gap-2 justify-end">
        <span>{currentSort === "newest" ? "최신순" : "오래된순"}</span>
        <img src={isOpen ? "/icons/arrow-up(B).svg" : "/icons/arrow-down.svg"} alt="arrow-icon" className="ml-2" />
      </button>

      {isOpen && (
        <ul className="absolute z-10 right-0 top-full mt-[10px] overflow-y-auto bg-white border border-gray03 rounded-lg">
          {["newest", "oldest"].map((sortType, index) => (
            <li
              key={sortType}
              onClick={() => handleSortChange(sortType as "newest" | "oldest")}
              className={`cursor-pointer px-4 py-2 text-sm text-black ${
                index === 0 ? "border-b border-gray03" : ""
              } hover:bg-gray-100`}
            >
              {sortType === "newest" ? "최신순" : "오래된순"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;
