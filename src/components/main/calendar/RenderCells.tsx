import { CalendarCellsProps, SortedDiaries } from "@/types/main/Calendar";
import { addDays, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import React from "react";

// firstDayOfMonth : 현재 달의 시작일
// lastDayOfMonth : 현재 달의 마지막 날
// startDate : firstDayOfMonth가 속한 주의 시작일
// endDate : lastDayOfMonth가 속한 주의 마지막일
// rows : [일월화수목금토] 한 주 * 4 또는 5주
// days : [일월화수목금토] 한 주
// cloneDay 형식 //Tue Oct 08 2024 00:00:00 GMT+0900 (한국 표준시)
const RenderCells = ({ currentDate, onDateClick, filterDiaries }: CalendarCellsProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);

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
          className={`col cell ${
            !isSameMonth(day, firstDayOfMonth) // 현재 달과 다른 달에 해당하는 날짜
              ? "disabled"
              : format(currentDate, "M") !== format(day, "M")
              ? "not-valid"
              : "valid"
          }`}
          key={day.toString()}
          onClick={() => onDateClick(cloneDay)}
        >
          <span className={format(currentDate, "M") !== format(day, "M") ? "text not-valid text-slate-300" : ""}>
            {formattedDate}
          </span>
          {emotionDate && <div className="emotion">{emotionDate.emotion}</div>}
        </div>
      );
      day = addDays(day, 1);
    }

    //일주일 단위로 날짜 셀(days)을 하나의 행(row)으로 묶어 추가
    rows.push(
      <div className="grid grid-cols-7 w-full text-center" key={day.toString()}>
        {days}
      </div>
    );

    // 한 주가 끝나면 days 배열을 비워서 다음 주의 날짜 셀을 준비
    days = [];
  }

  return <div className="body">{rows}</div>;
};

export default RenderCells;
