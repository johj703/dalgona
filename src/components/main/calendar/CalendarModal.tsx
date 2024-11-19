"use client";
import getLoginUser from "@/lib/getLoginUser";
import { CalendarModalProps } from "@/types/main/Calendar";
import { Select } from "@headlessui/react";
import { getDaysInMonth } from "date-fns";
import React, { useEffect, useState } from "react";

const CalendarModal = ({ clickModal, handleSearchDiaries, calenderInput, currentDate }: CalendarModalProps) => {
  const [userId, setUserId] = useState<string>("");

  //조회범위 모달창 디폴트로 현재날짜 설정해주기 위한 상태
  const [startYear, setStartYear] = useState<string>("");
  const [startMonth, setStartMonth] = useState<string>("");
  const [startDay, setStartDay] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endDay, setEndDay] = useState<string>("");

  const daysInMonth = getDaysInMonth(new Date(Number(startYear), Number(+startMonth - 1))); //2월이면 29
  const initDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  //해당 월의 일자배열
  const [startDays, setStartDays] = useState<number[]>(initDays);
  const [endDays, setEndDays] = useState<number[]>(initDays);

  //날짜범위
  const years = Array.from({ length: 8 }, (_, i) => i + 2017).reverse();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  //현재날짜
  const year = currentDate.getFullYear().toString(); //2024
  const month = (currentDate.getMonth() + 1).toString(); //11
  const day = currentDate.getDate().toString(); //12

  // userId를 가져오는 함수 실행
  useEffect(() => {
    const fetchUserId = async () => {
      const data = await getLoginUser();
      if (data) setUserId(data.id);
    };
    fetchUserId();
  }, []);

  //디폴트 값으로 오늘 날짜
  useEffect(() => {
    setStartYear(year);
    setStartMonth(month);
    setStartDay(day);
    setEndYear(year);
    setEndMonth(month);
    setEndDay(day);
  }, [year, month, day]); //REVIEW -

  const handleSelect = async () => {
    const startDate =
      startYear + "년 " + String(startMonth).padStart(2, "0") + "월 " + String(startDay).padStart(2, "0") + "일";
    const endDate =
      endYear + "년 " + String(endMonth).padStart(2, "0") + "월 " + String(endDay).padStart(2, "0") + "일";
    handleSearchDiaries(startDate, endDate, userId);
    calenderInput(startDate, endDate);
    clickModal();
  };

  //시작&종료일자 년,월 변경시
  useEffect(() => {
    const startsDaysInMonth = getDaysInMonth(new Date(Number(startYear), Number(+startMonth - 1)));
    const startDaysArray = Array.from({ length: startsDaysInMonth }, (_, i) => i + 1);
    setStartDays(startDaysArray);

    const endDaysInMonth = getDaysInMonth(new Date(Number(endYear), Number(+endMonth - 1)));
    const endDaysArray = Array.from({ length: endDaysInMonth }, (_, i) => i + 1);
    setEndDays(endDaysArray);
  }, [startYear, startMonth, endYear, endMonth]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-75 z-[999]"
      onClick={clickModal}
    >
      <div
        className=" bg-white rounded-lg shadow-md  max-w-md h-[320px] w-[343px] mb-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[18px] mx-[113px] justify-center items-center gap-[10px] inline-flex">
          <p className="text-center w-[100px] font-['LeferiBaseType-RegularA'] text-[16px] font-[400] not-italic leading-[21.6px] my-[10px]">
            조회기간 설정
          </p>
        </div>
        <div className="pt-4 pb-6 px-6">
          <p className="text-center w-[70px] font-['LeferiBaseType-RegularA'] text-[14px] font-[400] not-italic leading-[21px] pb-[8px]">
            시작 일자
          </p>
          <div className="selectStartDate flex gap-4 mb-[20px]">
            <div>
              <Select
                name="year"
                aria-label="Project status"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="border-[1px] rounded-lg border-[#BFBFBF] p-[5px] w-[70px] h-[36px] mr-[5px]"
              >
                {years.map((y, idx) => (
                  <option value={y} key={idx} className="text-[12px]">
                    {y}
                  </option>
                ))}
              </Select>
              <span>년</span>
            </div>
            <div>
              <Select
                name="month"
                aria-label="Project status"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="border-[1px] rounded-lg border-[#BFBFBF] p-[5px] w-[70px] h-[36px] mr-[5px]"
              >
                {months.map((m, idx) => (
                  <option value={m} key={idx}>
                    {m}
                  </option>
                ))}
              </Select>
              <span>월</span>
            </div>
            <div>
              <Select
                name="day"
                aria-label="Project status"
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                className="border-[1px] rounded-lg border-[#BFBFBF] p-[5px] w-[70px] h-[36px] mr-[5px]"
              >
                {startDays.map((d, idx) => (
                  <option value={d} key={idx}>
                    {d}
                  </option>
                ))}
              </Select>
              <span>일</span>
            </div>
          </div>

          <p className="text-center w-[70px] font-['LeferiBaseType-RegularA'] text-[14px] font-[400] not-italic leading-[21px] pb-[8px]">
            종료 일자
          </p>
          <div className="selectEndDate flex gap-4">
            <div>
              <Select
                name="year"
                aria-label="Project status"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="border-[1px] rounded-lg border-[#BFBFBF] p-[5px] w-[70px] h-[36px] mr-[5px]"
              >
                {years.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <span>년</span>
            </div>
            <div>
              <Select
                name="month"
                aria-label="Project status"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="border-[1px] rounded-lg border-[#BFBFBF] p-[5px] w-[70px] h-[36px] mr-[5px]"
              >
                {months.map((month) => (
                  <option value={month} key={month}>
                    {month}
                  </option>
                ))}
              </Select>
              <span>월</span>
            </div>
            <div>
              <Select
                name="day"
                aria-label="Project status"
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
                className="border-[1px] rounded-lg border-[#BFBFBF] p-[5px] w-[70px] h-[36px] mr-[5px]"
              >
                <option value="none">선택</option>
                {endDays.map((day) => (
                  <option value={day} key={day}>
                    {day}
                  </option>
                ))}
              </Select>
              <span>일</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-[30px]">
          <button
            className="w-[120px] h-[45px] rounded-lg bg-white text-center text-[#D84E35] border-[1px] border-[#D84E35]"
            onClick={clickModal}
          >
            뒤로가기
          </button>
          <button
            className="w-[120px] h-[45px] rounded-lg bg-[#D84E35] text-center text-white border-[1px] border-[#D84E35]"
            onClick={handleSelect}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
