import React from "react";
import Link from "next/link";

const MonthSelector: React.FC<{ year: number }> = ({ year }) => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {months.map((month) => (
          <Link
            key={month}
            href={`/library/${year}/${month}`}
            className="block border p-6 rounded-lg bg-gray-200 text-center hover:bg-gray-300 transition"
          >
            {month}월
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MonthSelector;
