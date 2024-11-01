"use client";
import { useEffect, useState } from "react";
import { SortedDiaries } from "@/types/main/Calendar";
import { format, addMonths, subMonths } from "date-fns";
import { getSelectedDiaries, useFetchDiaries } from "@/queries/fetchDiaries";
import RenderHeader from "./RenderHeader";
import RenderDays from "./RenderDays";
import RenderCells from "./RenderCells";
import DiarySelectedList from "./DiarySelectedList";
import CalendarModal from "./CalendarModal";
import "react-datepicker/dist/react-datepicker.css";

//TODO - 달력 접기
//TODO - 이미지(감정) 가져오기
//TODO - css - 오늘날짜 하단밑줄
//TODO - 감정있으면 날짜대신 감정이모지 / 감정이모지 없으면 날짜로

export default function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [rangeList, setRangeList] = useState<SortedDiaries[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //input창에 날짜범위담는상태
  const [firstDate, setFirstDate] = useState<string>("");
  const [secondDate, setSecondDate] = useState<string>("");
  console.log(setStartDate);

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

  //REVIEW - 해당되는 날짜의 감정 가져오기
  //TODO - diary 테이블에 감정null인 경우 에러남...
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

  //캘린더 셀 클릭
  const onDateClick = async (day: Date) => {
    const formatStartDate = format(day, "yyyy년 MM월 dd일");
    const formatEndDate = format(day, "yyyy년 MM월 dd일");
    const searchList = await getSelectedDiaries(formatStartDate, formatEndDate);
    setRangeList(searchList);
  };

  //캘린더 조회기간 설정해서 데이터 가져오기
  const handleSearchDiaries = async (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const searchList = await getSelectedDiaries(startDate, endDate);
      setRangeList(searchList);
    }
  };

  //input창에 범위 넣는 함수
  const calenderInput = (first: string, second: string) => {
    if (first && second) {
      setFirstDate(first);
      setSecondDate(second);
    }
  };

  //전체기간 버튼
  const InitializationInput = () => {
    setFirstDate("");
    setSecondDate("");
  };

  //버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  const clickModal = () => setIsModalOpen(!isModalOpen);
  return (
    <>
      <div>
        <div className="flex justify-between h-[30px]">
          <button onClick={clickModal} className="p-2 rounded-lg bg-gray-200 text-sm ">
            조회기간 설정
          </button>
          {isModalOpen && (
            <CalendarModal
              clickModal={clickModal}
              handleSearchDiaries={handleSearchDiaries}
              calenderInput={calenderInput}
              currentDate={currentDate}
            />
          )}
          {firstDate && secondDate ? (
            <div className="flex text-sm ">
              <input type="text" className="w-[80px] border-2" value={firstDate} readOnly /> ~
              <input type="text" className="w-[80px] border-2" value={secondDate} readOnly />
            </div>
          ) : (
            <div></div>
          )}

          <button className="p-2 rounded-lg bg-gray-200 text-sm" onClick={InitializationInput}>
            전체기간
          </button>
        </div>
        <div className="p-2  border-2 rounded-lg my-4">
          <RenderHeader currentDate={currentDate} prevMonth={prevMonth} nextMonth={nextMonth} />
          <RenderDays />
          <RenderCells currentDate={currentDate} onDateClick={onDateClick} filterDiaries={filterDiaries || []} />
        </div>
      </div>
      <DiarySelectedList rangeList={rangeList} />
    </>
  );
}
