import React from "react";

const RenderDays = () => {
  const DAY_LIST: string[] = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="grid grid-cols-7 w-full text-center">
      {DAY_LIST.map((day, index) => {
        return <div key={`${index}day`}>{day}</div>;
      })}
    </div>
  );
};

export default RenderDays;
