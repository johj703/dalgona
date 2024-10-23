"use client";

import React from "react";
import YearSelector from "@/components/library/YearSelector";

const LibraryPage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleYearChange = (year: number) => {
    console.log(year);
  };

  return (
    <div>
      <YearSelector currentYear={currentYear} onYearChange={handleYearChange} />
    </div>
  );
};

export default LibraryPage;
