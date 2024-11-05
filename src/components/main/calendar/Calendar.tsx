"use client";
import { useState } from "react";
import { SortedDiaries } from "@/types/main/Calendar";
import { format, addMonths, subMonths } from "date-fns";
import { getSelectedDiaries, useFetchDiaries } from "@/lib/main/fetchDiaries";
import RenderHeader from "./RenderHeader";
import RenderDays from "./RenderDays";
import RenderCells from "./RenderCells";
import DiarySelectedList from "./DiarySelectedList";
import CalendarModal from "./CalendarModal";
import "react-datepicker/dist/react-datepicker.css";
import { getSimpleMonth, getSimpleYear } from "@/utils/calendar/dateFormat";

//TODO - 달력 접기
//TODO - 이미지(감정) 가져오기
//TODO - 감정있으면 날짜대신 감정이모지 / 감정이모지 없으면 날짜로
//TODO - 하루에 일기를 여러개 작성할경우 달력에 보이는 감정이모지는??

export default function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [rangeList, setRangeList] = useState<SortedDiaries[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //input창에 날짜범위담는상태
  const [firstDate, setFirstDate] = useState<string>("");
  const [secondDate, setSecondDate] = useState<string>("");

  //일기 전체 데이터 가져오기
  const { data: diaries } = useFetchDiaries();

  //이게 왜 있지...?
  // useEffect(() => {
  //   if (diaries) {
  //     const formatTodayDate = format(new Date(), "yyyy년 MM월 dd일");
  //     console.log("🚀 ~ useEffect ~ formatTodayDate:", formatTodayDate);
  //     const searchDiaries = diaries?.find((diary: SortedDiaries) => diary.date === formatTodayDate);
  //     console.log("🚀 ~ useEffect ~ searchDiaries:", searchDiaries);
  //     if (searchDiaries) {
  //       setRangeList([...rangeList, { ...searchDiaries }]); //REVIEW -
  //     }
  //   }
  // }, []);

  //TODO - 전체데이터에서 currentDate에 작성한 일기들만 반환
  //TODO - diary 테이블에 감정null인 경우 에러남... 일기쓸때 꼭넣어야하는지 안넣어두 되는지??
  const filterDiaries = diaries?.filter((diary: SortedDiaries) => {
    const filterMonth: string = getSimpleMonth(diary.date); //10
    const filterYear: string = getSimpleYear(diary.date); //2024
    return filterMonth == (currentDate.getMonth() + 1).toString() && filterYear == currentDate.getFullYear().toString();
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
    setSelectedDate(new Date(day));
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
          <RenderCells
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateClick={onDateClick}
            filterDiaries={filterDiaries || []}
          />
        </div>
      </div>
      <DiarySelectedList rangeList={rangeList} selectedDate={selectedDate} />
    </>
  );
}
