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
import getLoginUser from "@/lib/getLoginUser";

export default function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [rangeList, setRangeList] = useState<SortedDiaries[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //input창에 날짜범위담는상태
  const [firstDate, setFirstDate] = useState<string>("");
  const [secondDate, setSecondDate] = useState<string>("");

  //유저 데이터 담기
  const [userId, setUserId] = useState<string>("");
  //일기 전체 데이터 가져오기
  const { data: diaries } = useFetchDiaries(userId);

  useEffect(() => {
    // userId를 가져오는 함수 실행
    const fetchUserId = async () => {
      const data = await getLoginUser();
      if (data) setUserId(data.id);
    };
    fetchUserId();
  }, []);

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
  const onDateClick = async (day: Date, user_id: string) => {
    const formatStartDate = format(day, "yyyy년 MM월 dd일");
    const formatEndDate = format(day, "yyyy년 MM월 dd일");
    const searchList = await getSelectedDiaries(formatStartDate, formatEndDate, user_id);
    setRangeList(searchList);
    setSelectedDate(new Date(day));
  };

  //캘린더 조회기간 설정해서 데이터 가져오기
  const handleSearchDiaries = async (startDate: string, endDate: string, user_id: string) => {
    if (startDate && endDate) {
      const searchList = await getSelectedDiaries(startDate, endDate, user_id);
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
    <div className="flex flex-col gap-[6px] lg:flex-row lg:gap-[16px] lg:mt-[24px]">
      <div className="flex flex-col justify-center items-center lg:justify-start">
        <div className="button-dummy flex justify-between items-center self-stretch px-[16px] lg:px-0 lg:w-[100%] lg:justify-start lg:gap-[16px]">
          <button
            onClick={clickModal}
            className="border-[2px] border-black rounded-lg bg-[#EFE6DE] py-[8px] px-[10px] font-['LeferiBaseType-RegularA'] text-[12px] not-italic font-[400] leading-[18px] lg:p-[10px] lg:text-[18px] lg:font-['Dovemayo_gothic']"
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
                className="border-[1px] border-[#2E5342] rounded-lg h-[22px] w-[70px] bg-[#FDF7F4] text-center font-['Pretendard-Regular'] text-[12px] not-italic font-[400] leading-normal lg:px-[8px] lg:py-[4px] lg:bg-white lg:text-[16px] lg:font-['Dovemayo_gothic'] lg:w-[100px] lg:h-[40px]"
                value={getSimpleFullDate(firstDate)}
                readOnly
              />
              <div>~</div>
              <input
                type="text"
                className="border-[1px] border-[#2E5342] rounded-lg h-[22px] w-[70px] bg-[#FDF7F4] text-center font-['Pretendard-Regular'] text-[12px] not-italic font-[400] leading-normal lg:px-[8px] lg:py-[4px] lg:bg-white lg:text-[16px] lg:font-['Dovemayo_gothic'] lg:w-[100px] lg:h-[40px]"
                value={getSimpleFullDate(secondDate)}
                readOnly
              />
            </div>
          ) : (
            <div></div>
          )}

          <button
            className="border-[2px] border-black rounded-lg bg-[#EFE6DE] py-[8px] px-[10px] font-['LeferiBaseType-RegularA'] text-[12px] not-italic font-[400] leading-[18px] lg:p-[10px] lg:text-[18px] lg:font-['Dovemayo_gothic'] lg:hidden"
            onClick={InitializationInput}
          >
            전체기간
          </button>
        </div>
        <div className="calendar w-[calc(100%-32px)] py-[16px]  my-[8px] mx-[16px] px-[16px] pb-[4px] border-[1px] border-black rounded-lg bg-[#EFE6DE] flex flex-col justify-center items-center gap-[2px] lg:w-[100%] lg:mx-0 lg:py-[50px] lg:px-[40px]">
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
