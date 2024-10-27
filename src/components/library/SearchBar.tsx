import React from "react";

import { SearchBarProps } from "@/types/library/Diary";

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => (
  <input
    type="text"
    placeholder="일기를 검색해주세요"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border rounded p-2 mb-4 w-full"
  />
);

export default SearchBar;
