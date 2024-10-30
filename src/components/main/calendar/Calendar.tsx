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

//TODO - 조회기간설정 - 디폴트 오늘날짜
//TODO - 조회기간설정 - 완료버튼 클릭 시 기간이 달력위에 보이게
//TODO - 달력 접기
//TODO - 이미지 가져오기
//TODO - 전체기간 클릭 시 초기화

export default function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [rangeList, setRangeList] = useState<SortedDiaries[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
  //TODO - diary 테이블에 data없을 경우 에러남...
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

  //캘린더 조회기간 설정
  const handleSearchDiaries = async (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const searchList = await getSelectedDiaries(startDate, endDate);
      setRangeList(searchList);
    }
  };

  //버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
  const clickModal = () => setIsModalOpen(!isModalOpen);
  return (
    <>
      <div>
        <div className="flex justify-between">
          <button onClick={clickModal} className="p-2 rounded-lg bg-gray-200 text-sm">
            조회기간 설정
          </button>
          {isModalOpen && <CalendarModal clickModal={clickModal} handleSearchDiaries={handleSearchDiaries} />}
          <p className="p-2">전체기간</p>
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
