import React from "react";
import Link from "next/link";

const MonthSelector: React.FC<{ year: number }> = ({ year }) => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className="h-[645px] pb-12 bg-[#e7e1e1] flex-col justify-start items-center mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {months.map((month) => (
          <Link
            key={month}
            href={`/library/${year}/${month}`}
            className="w-[100px] h-[120px] border rounded-lg bg-[#9c9696] flex items-center justify-center text-center"
          >
            {month}월
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MonthSelector;
