import { CellsProps, SortedDiaries } from "@/types/main/Calendar";
import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import defaultEmotion from "../../../../public/images/main/State=blank.png";
import Image from "next/image";
import React from "react";
import { getEmoji } from "@/utils/diary/getEmoji";
// import { GetEmoji } from "@/utils/diary/GetEmoji";

const RenderCells = ({ currentDate, selectedDate, onDateClick, filterDiaries }: CellsProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);

  const todayDate = new Date().getDate().toString();
  const todayMonth = (new Date().getMonth() + 1).toString();

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  //달력의 주 단위로 반복하면서 날짜 랜더링
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d"); //1
      const cloneDay = day;

      //해당 달에 일기 쓴날의 데이터(filterDiaries)와 해당 달의 전체 날짜(cloneDay) 비교해서 일기 쓴 날짜만 찾기
      const formatDate = format(cloneDay, "yyyy년 MM월 dd일");
      //일기 데이터(filterDiaries)에서 formatDate해당하는 데이터를 찾기
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
          onClick={() => onDateClick(cloneDay)}
        >
          {emotionDate ? (
            <div className="emotion flex flex-col justify-center items-center self-stretch">
              <img src={getEmoji(emotionDate.emotion, "on")} alt={emotionDate.emotion} className="h-[30px]" />
            </div>
          ) : (
            <div>
              <Image src={defaultEmotion} width={30} height={30} alt="Picture of the author" />
            </div>
          )}
          <div
            className={
              format(currentDate, "M") !== format(day, "M")
                ? "text not-valid h-[30px] p-[10px] flex flex-col justify-center items-center gap-[10px] self-stretch"
                : format(day, "M") === todayMonth && format(day, "d") === todayDate
                ? "today  h-[30px] p-[10px]  flex flex-col justify-center items-center gap-[10px] self-stretch border-b-2 border-rose-500"
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
      <div className="flex w-[325px] justify-center items-center gap-[12px]" key={day.toString()}>
        {days}
      </div>
    );

    // 한 주가 끝나면 days 배열을 비워서 다음 주의 날짜 셀을 준비
    days = [];
  }

  return <div className="body">{rows}</div>;
};

export default RenderCells;
