"use client";
import { CellsProps, SortedDiaries } from "@/types/main/Calendar";
import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import defaultEmotion from "../../../../public/images/main/State=blank.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getEmoji } from "@/utils/diary/getEmoji";
import getLoginUser from "@/lib/getLoginUser";

const RenderCells = ({ currentDate, selectedDate, onDateClick, filterDiaries, isTodayClick }: CellsProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);

  const todayDate = new Date().getDate().toString();
  const todayMonth = (new Date().getMonth() + 1).toString();

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // userId를 가져오는 함수 실행
    const fetchUserId = async () => {
      const data = await getLoginUser();
      if (data) setUserId(data.id);
    };
    fetchUserId();
  }, []);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  //달력의 주 단위로 반복하면서 날짜 랜더링
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d"); //1
      const cloneDay = day;

      const formatDate = format(cloneDay, "yyyy년 MM월 dd일");
      const emotionDate = filterDiaries?.find((diary: SortedDiaries) => diary.date === formatDate);

      days.push(
        <div
          className={`col cell w-[33px] mb-[5px] flex flex-col items-start shrink-0 gap-[4px] lg:mb-[12px] ${
            !isSameMonth(day, firstDayOfMonth) // 현재 달과 다른 달에 해당하는 날짜
              ? "disabled"
              : isSameDay(day, selectedDate)
              ? "selected"
              : format(currentDate, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          } `}
          key={day.toString()}
          onClick={() => onDateClick(cloneDay, userId)}
        >
          {emotionDate ? (
            <div className={"emotion flex flex-col justify-center items-center self-stretch"}>
              <img src={getEmoji(emotionDate.emotion, "on")} alt={emotionDate.emotion} />
            </div>
          ) : (
            <div>
              <Image src={defaultEmotion} width={30} height={30} alt="defaultEmotion" />
            </div>
          )}
          <div
            className={
              format(currentDate, "M") !== format(day, "M")
                ? "text not-valid flex flex-col justify-center items-center gap-[10px] self-stretch border-[1px] bg-[#EFE6DE] text-[#A6A6A6]"
                : format(day, "d") === format(selectedDate, "d")
                ? "selected flex flex-col justify-center items-center gap-[10px] self-stretch border-[1px] bg-[#2E5342] rounded-2xl text-white"
                : format(day, "M") === todayMonth && format(day, "d") === todayDate
                ? "today flex flex-col justify-center items-center gap-[10px] self-stretch border-[1px] bg-white rounded-2xl"
                : "flex flex-col justify-center items-center gap-[10px] self-stretch border-[1px] bg-[#EFE6DE]"
            }
          >
            {formattedDate}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    //일주일 단위로 날짜 셀(days)을 하나의 행(row)으로 묶어 추가
    rows.push(
      <div className="flex justify-between items-center w-[100%] px-[5px]" key={day.toString()}>
        {days}
      </div>
    );
    // 한 주가 끝나면 days 배열을 비워서 다음 주의 날짜 셀을 준비
    days = [];
  }

  return (
    <>
      <div className="body w-[100%]">{rows}</div>
      <button
        onClick={() => isTodayClick(new Date(), userId)}
        className="text-[14px] font-[500] font-['Dovemayo'] text-[#2E5342]"
      >
        오늘
      </button>
    </>
  );
};

export default RenderCells;
