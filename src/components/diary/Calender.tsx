"use client";

import RenderHeader from "./RenderHeader";
import { useEffect, useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { RenderCells } from "./RenderCells";
import { booleanState, FormData, FormState } from "@/types/Canvas";
import { CustomAlert } from "../CustomAlert";
import RenderDays from "./RenderDays";

type CalenderProps = {
  setFormData: FormState;
  formData: FormData;
  setOpenCalender: booleanState;
};

const Calender = ({ formData, setFormData, setOpenCalender }: CalenderProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(
      `${formData.date.slice(0, 4)}-${formData.date.split("월")[0].slice(-2)}-${formData.date
        .split("일")[0]
        .slice(-2)} `
    )
  );
  const [formatClickDate, setFormatClickDate] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const customAlert = {
    type: "fail",
    text: "아직 다가오지 않은 날이에요.",
    position: "absolute left-1/2 -translate-x-1/2 -top-3 -translate-y-full"
  };

  //달력 셀 클릭
  const onDateClick = async (day: Date) => {
    if (new Date() < new Date(day)) return setIsError(true);

    setSelectedDate(new Date(day));
    setFormatClickDate(format(new Date(day), "yyyy년 MM월 dd일"));
  };

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, [isError]);

  // 이전 월로 이동하는 함수
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1)); //subMonths : 현재달에서 한달 빼기
  };

  //다음 월로 이동하는 함수
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1)); //addMonths : 현재달에서 한달 더하기
  };

  return (
    <>
      <div className="fixed top-0 bottom-0 right-0 left-0 bg-black opacity-70"></div>
      <div className="fixed top-1/2 left-0 -translate-y-1/2 w-full p-[18px] pb-6 bg-white rounded-lg border border-black">
        <div className="p-[10px] text-center text-base leading-[1.35] mb-[6px]">날짜 선택</div>
        <div className="p-4 pb-12 border border-black rounded-lg bg-background01">
          <RenderHeader currentDate={currentDate} prevMonth={prevMonth} nextMonth={nextMonth} />
          <RenderDays />
          <RenderCells
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            filterDiaries={[]}
          />
        </div>

        <div className="mt-[26px] flex justify-center gap-4">
          <button
            className="flex items-center justify-center w-[144px] h-[53px] border border-primary rounded-lg text-base leading-normal bg-white text-primary"
            onClick={() => setOpenCalender(false)}
          >
            뒤로가기
          </button>
          <button
            className="flex items-center justify-center w-[144px] h-[53px] border border-primary rounded-lg text-base leading-normal bg-primary text-white"
            onClick={() => {
              if (formatClickDate) setFormData({ ...formData, date: formatClickDate });
              setOpenCalender(false);
            }}
          >
            완료
          </button>
        </div>

        {/* 커스텀 알럿 */}
        {isError && CustomAlert(customAlert)}
      </div>
    </>
  );
};
export default Calender;
