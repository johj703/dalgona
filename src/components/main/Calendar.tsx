"use client";
import React, { useEffect, useState } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { isSameMonth, isSameDay, addDays } from "date-fns";
import { Icon } from "@iconify/react";
import { getSelectedDiaries, useFetchDiaries } from "@/queries/fetchDiaries";
import { SortedDiaries } from "./DiaryList";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
//   onDateClick: (arg0: Date) => void;
//   filterDiaries: SortedDiaries[];
// };

// firstDayOfMonth : 현재 달의 시작일
// lastDayOfMonth : 현재 달의 마지막 날
// startDate : firstDayOfMonth가 속한 주의 시작일
// endDate : lastDayOfMonth가 속한 주의 마지막일
// rows : [일월화수목금토] 한 주 * 4 또는 5주
// days : [일월화수목금토] 한 주
// cloneDay 형식 //Tue Oct 08 2024 00:00:00 GMT+0900 (한국 표준시)
const RenderCells = ({ currentMonth, selectedDate, onDateClick, filterDiaries }) => {
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

type Dates = {
  rangeList: SortedDiaries[] | undefined;
};

const DiarySelectedList = ({ rangeList }: Dates) => {
  return (
    <>
      {rangeList && rangeList.length > 0 ? (
        rangeList.map((list) => (
          // 범위가 설정되었을 때 rangeList 표시
          <div key={list.id}>
            <div className="p-4 mb-2 border-2">
              <div>
                <div className="border-2 h-[200px]">
                  이미지
                  <span>{list.date}</span>
                </div>
                <p className="border-2 my-2">{list.contents}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        // 범위도 없고, 해당 날짜의 다이어리가 없는 경우
        <div className="flex justify-center items-center m-2 p-12 border-2">
          <div>
            <p>작성된 일기가 없어요🥹</p>
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

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rangeList, setRangeList] = useState<SortedDiaries[]>([]);

  //일기 전체 데이터 가져오기
  const { data: diaries, error, isLoading } = useFetchDiaries();

  //REVIEW - useEffect가 실행될 때 diaries가 아직 로딩 중일 수 있기 때문에, diaries가 undefined일 가능성
  useEffect(() => {
    if (diaries) {
      const formatTodayDate = format(startDate, "yyyy년 MM월 dd일");
      const searchDiaries = diaries?.find((diary: SortedDiaries) => diary.date === formatTodayDate);
      setRangeList(searchDiaries);
    }
  }, []);

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

  //달력 셀 클릭
  const onDateClick = async (day: Date) => {
    const formatStartDate = format(day, "yyyy년 MM월 dd일");
    const formatEndDate = format(day, "yyyy년 MM월 dd일");
    const searchList = await getSelectedDiaries(formatStartDate, formatEndDate);
    setRangeList(searchList);
  };

  //조회기간 설정 버튼 클릭
  const handleSearchDiaries = async (startDate: Date, endDate: Date) => {
    const formatStartDate = format(startDate, "yyyy년 MM월 dd일");
    const formatEndDate = format(endDate, "yyyy년 MM월 dd일");
    const searchList = await getSelectedDiaries(formatStartDate, formatEndDate);
    setRangeList(searchList);
  };

  return (
    <>
      <div>
        <div className="flex">
          <button onClick={() => handleSearchDiaries(startDate, endDate)}>조회기간 설정</button>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-[70px]"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-[70px]"
          />
          <p>전체기간</p>
        </div>
        <div className="pt-2 border-2 ">
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
      <DiarySelectedList rangeList={rangeList} />
    </>
  );
}
