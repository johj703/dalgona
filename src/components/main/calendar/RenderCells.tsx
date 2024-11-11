"use client";
import { CellsProps, SortedDiaries } from "@/types/main/Calendar";
import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import defaultEmotion from "../../../../public/images/main/State=blank.png";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getEmoji } from "@/utils/diary/getEmoji";
import getLoginUser from "@/lib/getLoginUser";

// border-b-2 border-rose-500
const RenderCells = ({ currentDate, selectedDate, onDateClick, filterDiaries }: CellsProps) => {
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
          className={`col cell w-[33px] flex flex-col items-start shrink-0 ${
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
            <div
              className={
                format(day, "M") === todayMonth && format(day, "d") === todayDate
                  ? "emotion flex flex-col justify-center items-center self-stretch border-[2px] border-[#D84E35] rounded-full"
                  : "emotion flex flex-col justify-center items-center self-stretch"
              }
            >
              <img src={getEmoji(emotionDate.emotion, "on")} alt={emotionDate.emotion} className="h-[30px]" />
            </div>
          ) : (
            <div>
              <Image src={defaultEmotion} width={30} height={30} alt="defaultEmotion" />
            </div>
          )}
          <div
            className={
              format(currentDate, "M") !== format(day, "M")
                ? "text not-valid h-[30px] p-[10px] flex flex-col justify-center items-center gap-[10px] self-stretch"
                : format(day, "M") === todayMonth && format(day, "d") === todayDate
                ? "today h-[30px] p-[10px]  flex flex-col justify-center items-center gap-[10px] self-stretch text-[#D84E35]"
                : "h-[30px] p-[10px] flex flex-col justify-center items-center gap-[10px] self-stretch"
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

  return <div className="body w-[100%]">{rows}</div>;
};

export default RenderCells;
