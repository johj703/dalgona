import React from "react";

import { SearchBarProps } from "@/types/library/Diary";

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => (
  <div className="relative">
    <img
      src="/icons/search-icon.svg"
      alt="Search Icon"
      className="absolute left-3 top-1/2 transform -translate-y-1/2"
    />
    <input
      type="text"
      placeholder="일기를 검색해주세요"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border border-[#A6A6A6] rounded-lg p-2 pl-10 w-full bg-white text-[#A6A6A6] placeholder-gray-400"
    />
  </div>
);

export default SearchBar;
