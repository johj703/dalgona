"use client";
import React, { useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays, parse } from "date-fns";
import { Icon } from "@iconify/react";
import { useFetchDiaries } from "@/queries/fetchDiaries";
import { SortedDiaries } from "./DiaryList";
import Link from "next/link";

type HeaderProps = {
  currentMonth: Date;
  prevMonth: () => void;
  nextMonth: () => void;
};

const RenderHeader = ({ currentMonth, prevMonth, nextMonth }: HeaderProps) => {
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

// type CellsProps = {
//   currentMonth: Date;
//   selectedDate: Date;
//   onDateClick: (day: Date) => void;
//   filterDiaries: SortedDiaries[];
// };
const RenderCells = ({ currentMonth, selectedDate, onDateClick, filterDiaries }) => {
  // firstDayOfMonth : 현재 달의 시작일
  // lastDayOfMonth : 현재 달의 마지막 날
  // startDate : firstDayOfMonth가 속한 주의 시작일
  // endDate : lastDayOfMonth가 속한 주의 마지막일
  // rows : [일월화수목금토] 한 주 * 4 또는 5주
  // days : [일월화수목금토] 한 주
  // cloneDay 형식 //Tue Oct 08 2024 00:00:00 GMT+0900 (한국 표준시)

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;

      //해당 달에 일기 쓴날의 데이터(filterDiaries)와 해당 달의 전체 날짜(cloneDay) 비교해서 일기 쓴 날짜만 찾기
      const formatDate = format(cloneDay, "yyyy년 MM월 dd일");
      //일기 데이터(filterDiaries)에서 formatDate해당하는 데이터를 찾기
      const emotionDate = filterDiaries.find((diary: SortedDiaries) => diary.date === formatDate);

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
          onClick={() => onDateClick(cloneDay)}
        >
          <span className={format(currentMonth, "M") !== format(day, "M") ? "text not-valid text-slate-300" : ""}>
            {formattedDate}
          </span>
          {emotionDate && <div className="emotion">{emotionDate.emotion}</div>}
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

// type Dates = {
//   selectedDate: Date;
//   currentMonth: Date;
//   diaries: SortedDiaries;
// };

const DiarySelectedList = ({ selectedDate, currentMonth, diaries }) => {
  const formatDate = format(currentMonth, "yyyy년 MM월 dd일");
  const todayDiary = diaries.find((diary: SortedDiaries) => diary.date === formatDate);
  console.log(selectedDate);

  return (
    <>
      {todayDiary ? (
        <div>
          <div key={todayDiary.id} className="p-4 mb-2 border-2">
            <div className="">
              <div className="border-2 h-[200px]">
                이미지
                <span>{todayDiary.date}</span>
              </div>
              <p className="border-2 my-2">{todayDiary.contents}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center m-2 p-12 border-2">
          <div>
            <p>오늘 작성된 일기가 없어요🥹</p>
            <p>이야기를 기록해보세요</p>
            <Link href={"/"}>
              <div>일기 쓰러가기</div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

//NOTE - 달력구현하기
export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date()); // 현재 선택된 달 저장하는 상태, 초기 값은 오늘 날짜의 달
  const [selectedDate, setSelectedDate] = useState(new Date()); // 사용자가 선택한 날짜를 저장하는 상태, 초기 값은 오늘 날짜

  //일기 전체 데이터 가져오기
  const { data: diaries, error, isLoading } = useFetchDiaries();
  if (error) return console.error("일기를 불러오는데 오류가 발생하였습니다." + error);
  if (isLoading) return console.error("로딩중입니다.");

  //REVIEW -
  const filterDiaries = diaries?.filter((diary) => {
    const filterMonth = diary.date.match(/\d{1,2}월/)[0].replace("월", "");
    const filterYear = diary.date.split("년")[0].trim();
    return filterMonth == currentMonth.getMonth() + 1 && filterYear == currentMonth.getFullYear();
  });

  // 이전 월로 이동하는 함수
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1)); //subMonths : 현재달에서 한달 빼기
  };

  //다음 월로 이동하는 함수
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1)); //addMonths : 현재달에서 한달 더하기
  };

  //특정 날짜 클릭했을때 해당 날짜를 selectedDate로 설정
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  return (
    <>
      <div className="pt-2 border-2 ">
        <div>
          <RenderHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
          <RenderDays />
          <RenderCells
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            filterDiaries={filterDiaries}
          />
        </div>
      </div>
      <DiarySelectedList selectedDate={selectedDate} currentMonth={currentMonth} diaries={diaries} />
    </>
  );
}
