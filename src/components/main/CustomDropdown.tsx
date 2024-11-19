import React, { useState } from "react";

const CustomDropdown = ({
  options,
  selectedValue,
  onSelect
}: {
  options: number[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 열기/닫기
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // 옵션 선택 처리
  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="relative inline-block w-[75px]">
      {/* 선택된 값 표시 */}
      <div
        onClick={toggleDropdown}
        className="border-[1px] border-[#BFBFBF] rounded-lg p-[5px] w-[75px] cursor-pointer"
      >
        {selectedValue}
      </div>
      <img
        src={isOpen ? "/icons/arrow-up(B).svg" : "/icons/arrow-down.svg"}
        alt="arrow-icon"
        className="absolute right-[7px] top-[14px]"
      />
      {/* 옵션 리스트 */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full border-[1px] border-[#BFBFBF] rounded-lg bg-white shadow-lg max-h-[150px] overflow-y-auto">
          {options.map((option, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(option.toString())}
              className={`p-[5px] border-b border-[#8C8C8C] hover:bg-[#F0F0F0] cursor-pointer ${
                option.toString() === selectedValue ? "bg-[#E0E0E0] font-bold" : ""
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
