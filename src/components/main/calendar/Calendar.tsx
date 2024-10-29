"use client";
import { useEffect, useState } from "react";
import { CellsProps, SortedDiaries } from "@/types/main/Calendar";
import { format, addMonths, subMonths, isSameMonth, isSameDay, addDays } from "date-fns";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { getSelectedDiaries, useFetchDiaries } from "@/queries/fetchDiaries";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import RenderHeader from "./RenderHeader";
import RenderDays from "./RenderDays";
import DiarySelectedList from "./DiarySelectedList";
// import CalendarModal from "./CalendarModal";

// firstDayOfMonth : 현재 달의 시작일
// lastDayOfMonth : 현재 달의 마지막 날
// startDate : firstDayOfMonth가 속한 주의 시작일
// endDate : lastDayOfMonth가 속한 주의 마지막일
// rows : [일월화수목금토] 한 주 * 4 또는 5주
// days : [일월화수목금토] 한 주
// cloneDay 형식 //Tue Oct 08 2024 00:00:00 GMT+0900 (한국 표준시)
const RenderCells = ({ currentDate, selectedDate, onDateClick, filterDiaries }: CellsProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
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
      const emotionDate = filterDiaries?.find((diary: SortedDiaries) => diary.date === formatDate);

      days.push(
        <div
          className={`col cell ${
            !isSameMonth(day, firstDayOfMonth)
              ? "disabled"
              : isSameDay(day, selectedDate)
              ? "selected"
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
    rows.push(
      <div className="grid grid-cols-7 w-full text-center" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return <div className="body">{rows}</div>;
};

export default function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [rangeList, setRangeList] = useState<SortedDiaries[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  console.log(setSelectedDate);

  //TODO - 모달상태
  // const [isModalOpen, setIsModalOpen] = useState(false);

  //일기 전체 데이터 가져오기
  const { data: diaries } = useFetchDiaries();

  //REVIEW - useEffect가 실행될 때 diaries가 아직 로딩 중일 수 있기 때문에, diaries가 undefined일 가능성이 있음 이케 맞나
  useEffect(() => {
    if (diaries) {
      const formatTodayDate = format(startDate, "yyyy년 MM월 dd일");
      const searchDiaries = diaries?.find((diary: SortedDiaries) => diary.date === formatTodayDate);
      if (searchDiaries) {
        setRangeList([...rangeList, { ...searchDiaries }]); //REVIEW -
      }
    }
  }, []);

  //REVIEW -
  const filterDiaries = diaries?.filter((diary) => {
    const filterMonth = diary.date.match(/\d{1,2}월/)[0].replace("월", "");
    const filterYear = diary.date.split("년")[0].trim();
    return filterMonth == currentDate.getMonth() + 1 && filterYear == currentDate.getFullYear();
  });

  // 이전 월로 이동하는 함수
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1)); //subMonths : 현재달에서 한달 빼기
  };

  //다음 월로 이동하는 함수
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1)); //addMonths : 현재달에서 한달 더하기
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

  //버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  // const clickModal = () => setIsModalOpen(!isModalOpen);
  return (
    <>
      <div>
        <div className="flex">
          <button onClick={() => handleSearchDiaries(startDate, endDate)}>조회기간 설정</button>
          {/* <button onClick={clickModal} className="px-4 py-2 rounded bg-gray-300 text-sm text-black hover:bg-gray-200">
            조회기간 설정
          </button> */}
          {/* {isModalOpen && <CalendarModal />} */}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
            dateFormat="yyyy-MM-dd"
            className="w-[70px]"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date as Date)}
            dateFormat="yyyy-MM-dd"
            className="w-[70px]"
          />
          <p>전체기간</p>
        </div>
        <div className="p-4 border-2 rounded-lg mt-4">
          <RenderHeader currentDate={currentDate} prevMonth={prevMonth} nextMonth={nextMonth} />
          <RenderDays />
          <RenderCells
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            filterDiaries={filterDiaries || []}
          />
        </div>
      </div>
      <DiarySelectedList rangeList={rangeList} />
    </>
  );
}
