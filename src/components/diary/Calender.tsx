"use client";
import RenderDays from "@/components/main/calendar/RenderDays";
import RenderHeader from "@/components/main/calendar/RenderHeader";
import { useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { RenderCells } from "./RenderCells";
import { booleanState, FormData, FormState } from "@/types/Canvas";
import { toast } from "garlic-toast";

type CalenderProps = {
  setFormData: FormState;
  formData: FormData;
  setOpenCalender: booleanState;
};

const Calender = ({ formData, setFormData, setOpenCalender }: CalenderProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formatClickDate, setFormatClickDate] = useState<string>("");

  //달력 셀 클릭
  const onDateClick = async (day: Date) => {
    if (new Date() < new Date(day)) return toast.error("미래보다 현재에 집중하라");
    setSelectedDate(new Date(day));
    setFormatClickDate(format(new Date(day), "yyyy년 MM월 dd일"));
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
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 pt-18px bg-white rounded-lg border border-black">
      <div className="p-[10px] text-base leading-tight">날짜 선택</div>
      <div className="p-4 border-2 rounded-lg">
        <RenderHeader currentDate={currentDate} prevMonth={prevMonth} nextMonth={nextMonth} />
        <RenderDays />
        <RenderCells
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateClick={onDateClick}
          filterDiaries={[]}
        />
      </div>

      <button onClick={() => setOpenCalender(false)}>뒤로가기</button>
      <button
        onClick={() => {
          setFormData({ ...formData, date: formatClickDate });
          setOpenCalender(false);
        }}
      >
        완료
      </button>
    </div>
  );
};
export default Calender;
