"use client";
import React, { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays, parse } from "date-fns";
import { Icon } from "@iconify/react";

const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
  return (
    <div>
      <div className="flex justify-between">
        <Icon icon="bi:arrow-left-circle-fill" onClick={prevMonth} />
        <h2>
          {format(currentMonth, "yyyy")} . {format(currentMonth, "M")}
        </h2>
        <Icon icon="bi:arrow-right-circle-fill" onClick={nextMonth} />
      </div>
    </div>
  );
};

const RenderDays = () => {
  // const days = [];
  const DAY_LIST: string[] = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div className="grid grid-cols-7 w-full text-center">
      {DAY_LIST.map((day, index) => {
        return <div key={`${index}day`}>{day}</div>;
      })}
    </div>
  );
};

const RenderCells = ({ currentMonth, selectedDate, onDateClick }) => {
  //현재 달의 시작일
  const firstDayOfMonth = startOfMonth(currentMonth);
  // 현재 달의 마지막 날
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  //firstDayOfMonth가 속한 주의 시작일
  const startDate = startOfWeek(firstDayOfMonth);
  //lastDayOfMonth가 속한 주의 마지막일
  const endDate = endOfWeek(lastDayOfMonth);

  const rows = []; // [일월화수목금토] 한 주 * 4 또는 5주
  let days = []; // [일월화수목금토] 한 주
  let day = startDate; //startDate
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      days.push(
        <div
          className={`col cell ${
            !isSameMonth(day, firstDayOfMonth)
              ? "disabled"
              : isSameDay(day, selectedDate)
              ? "selected"
              : format(currentMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }`}
          key={day}
          onClick={() => onDateClick(parse(cloneDay))}
        >
          <span className={format(currentMonth, "M") !== format(day, "M") ? "text not-valid" : ""}>
            {formattedDate}
          </span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 w-full text-center" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return <div className="body">{rows}</div>;
};

//NOTE - 달력구현하기
export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 이전 월로 이동하는 함수
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  //다음 월로 이동하는 함수
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  return (
    <div className="pt-2 border-2 ">
      <div>
        <RenderHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
        <RenderDays />
        <RenderCells currentMonth={currentMonth} selectedDate={selectedDate} onDateClick={onDateClick} />
      </div>
    </div>
  );
}
