import React, { useState } from "react";

interface SortDropdownProps {
  currentSort: "newest" | "oldest";
  onSortChange: (sort: "newest" | "oldest") => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSortChange = (value: "newest" | "oldest") => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative my-4 flex justify-end">
      <button onClick={toggleDropdown} className="px-4 py-2 border rounded bg-white">
        {currentSort === "newest" ? "최신순" : "오래된순"} ▼
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
          <ul className="py-1">
            <li onClick={() => handleSortChange("newest")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
              최신순
            </li>
            <li onClick={() => handleSortChange("oldest")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
              오래된순
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
