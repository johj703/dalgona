"use client";
import { useEffect, useState } from "react";
import { SortedDiaries } from "@/types/main/Calendar";
import { format, addMonths, subMonths } from "date-fns";
import { getSelectedDiaries, useFetchDiaries } from "@/lib/main/fetchDiaries";
import RenderHeader from "./RenderHeader";
import RenderDays from "./RenderDays";
import RenderCells from "./RenderCells";
import DiarySelectedList from "./DiarySelectedList";
import CalendarModal from "./CalendarModal";
import "react-datepicker/dist/react-datepicker.css";
import { getSimpleFullDate, getSimpleMonth, getSimpleYear } from "@/utils/calendar/dateFormat";

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

  //오늘의 일기 setRangeList에 담기 **
  useEffect(() => {
    if (diaries) {
      const formatTodayDate = format(new Date(), "yyyy년 MM월 dd일");
      const searchDiaries = diaries?.find((diary: SortedDiaries) => diary.date === formatTodayDate);
      if (searchDiaries) {
        setRangeList([...rangeList, { ...searchDiaries }]);
      }
    }
  }, [diaries]); //REVIEW - **

  //TODO - 전체데이터에서 currentDate에 작성한 일기들만 반환
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
    <div className="flex flex-col gap-[6px]">
      <div className="flex flex-col justify-center items-center">
        <div className="button-dummy py-[4px] px-[16px] flex justify-between items-center self-stretch">
          <button
            onClick={clickModal}
            className="border-[2px] border-black rounded-lg bg-[#EFE6DE] py-[8px] px-[10px] font-['LeferiBaseType-RegularA'] text-[12px] not-italic font-[400] leading-[18px]"
          >
            조회기간
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
            <div className="flex gap-[8px]">
              <input
                type="text"
                className="border-[1px] border-[#2E5342] rounded-lg w-[74] h-[22px] bg-[#FDF7F4] text-center font-['Pretendard'] text-[12px] not-italic font-[400] leading-normal"
                value={getSimpleFullDate(firstDate)}
                readOnly
              />
              <div>~</div>
              <input
                type="text"
                className="border-[1px] border-[#2E5342] rounded-lg w-[74] h-[22px] bg-[#FDF7F4] text-center font-['Pretendard'] text-[12px] not-italic font-[400] leading-normal"
                value={getSimpleFullDate(secondDate)}
                readOnly
              />
            </div>
          ) : (
            <div></div>
          )}

          <button
            className="border-[2px] border-black rounded-lg bg-[#EFE6DE] py-[8px] px-[10px] font-['LeferiBaseType-RegularA'] text-[12px] not-italic font-[400] leading-[18px]"
            onClick={InitializationInput}
          >
            전체기간
          </button>
        </div>
        <div className="calendar w-[356px] h-[416px] my-[10px] mx-[16px] px-[16px] pb-[4px] border-[1px] border-black rounded-lg bg-[#EFE6DE] flex flex-col justify-center items-center gap-[2px]">
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
    </div>
  );
}
