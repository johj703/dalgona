import React from "react";
import Link from "next/link";

const MonthSelector: React.FC<{ year: number }> = ({ year }) => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const rows = [];

  // 행 단위 (3X4)로 배열 분할
  for (let i = 0; i < months.length; i += 3) {
    rows.push(months.slice(i, i + 3));
  }

  return (
    <div className="h-[645px] mb-12 bg-[#EFE6DE] flex-col justify-start items-center mx-auto p-4">
      {rows.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <div className="grid grid-cols-3 gap-4">
            {row.map((month) => (
              <Link
                key={month}
                href={`/library/${year}/${month}`}
                className="w-[100px] h-[120px] flex items-center justify-center bg-[#D9D9D9] rounded-lg "
              >
                <img src={`/images/diary${month}.svg`} alt={`${month}월`} className="object-cover w-full h-full" />
              </Link>
            ))}
          </div>
          {/* 모든 행 아래에 선을 2개씩 추가 */}
          <div className="w-full h-[1px] bg-black mt-2 mb-1" />
          <div className="w-full h-[1px] bg-black mb-2" />
        </React.Fragment>
      ))}
    </div>
  );
};

export default MonthSelector;
