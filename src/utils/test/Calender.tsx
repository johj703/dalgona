"use client";
import RenderDays from "@/components/main/calendar/RenderDays";
import RenderHeader from "@/components/main/calendar/RenderHeader";
import { RenderCells } from "./RenderCells";
import { useState } from "react";
import { addMonths, format, subMonths } from "date-fns";

const Calender = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  //달력 셀 클릭
  const onDateClick = async (day: Date) => {
    const formatStartDate = format(day, "yyyy년 MM월 dd일");
    const formatEndDate = format(day, "yyyy년 MM월 dd일");
  };

  // 이전 월로 이동하는 함수
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1)); //subMonths : 현재달에서 한달 빼기
  };

  //다음 월로 이동하는 함수
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1)); //addMonths : 현재달에서 한달 더하기
  };

  return (
    <div className="p-4 border-2 rounded-lg mt-4">
      <RenderHeader currentDate={currentDate} prevMonth={prevMonth} nextMonth={nextMonth} />
      <RenderDays />
      <RenderCells currentDate={currentDate} selectedDate={selectedDate} onDateClick={onDateClick} filterDiaries={[]} />
    </div>
  );
};
export default Calender;
