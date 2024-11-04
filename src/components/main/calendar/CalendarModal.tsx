"use client";
import { CalendarModalProps } from "@/types/main/Calendar";
import { Select } from "@headlessui/react";
import React, { useEffect, useState } from "react";

const years = Array.from({ length: 9 }, (_, i) => i + 2017);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

//TODO - 조회기간 설정시 종료일자를 시작일자보다 전으로 설정하면 안됨

const CalendarModal = ({ clickModal, handleSearchDiaries, calenderInput, currentDate }: CalendarModalProps) => {
  const [startYear, setStartYear] = useState<string>("");
  const [startMonth, setStartMonth] = useState<string>("");
  const [startDay, setStartDay] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endDay, setEndDay] = useState<string>("");

  const year = currentDate.getFullYear().toString(); //2024
  const month = (currentDate.getMonth() + 1).toString(); //11

  const handleSelect = async () => {
    const startDate =
      startYear + "년 " + String(startMonth).padStart(2, "0") + "월 " + String(startDay).padStart(2, "0") + "일";
    const endDate =
      endYear + "년 " + String(endMonth).padStart(2, "0") + "월 " + String(endDay).padStart(2, "0") + "일";

    handleSearchDiaries(startDate, endDate);
    calenderInput(startDate, endDate);
    clickModal();
  };

  //디폴트 값으로 오늘 날짜
  useEffect(() => {
    setStartYear(year);
    setStartMonth(month);
    setEndYear(year);
    setEndMonth(month);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400 bg-opacity-75" onClick={clickModal}>
      <div className=" bg-white p-6 rounded-lg shadow-md w-full max-w-md h-[50vh]" onClick={(e) => e.stopPropagation()}>
        <p className="text-center text-lg font-bold">조회기간 설정</p>
        <div className="py-6 mb-[20px] px-6">
          <p className="text-sm	">시작 일자</p>
          <div className="flex gap-4 mb-[20px]">
            <div>
              <Select
                name="year"
                aria-label="Project status"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="border-2 rounded-md p-2 mr-2"
              >
                {years.map((y, idx) => (
                  <option value={y} key={idx}>
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
                className="border-2 rounded-md p-2 mr-2"
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
                className="border-2 rounded-md p-2 mr-2"
              >
                <option value="none">선택</option>
                {days.map((d, idx) => (
                  <option value={d} key={idx}>
                    {d}
                  </option>
                ))}
              </Select>
              <span>일</span>
            </div>
          </div>

          <p className="text-sm	">종료 일자</p>
          <div className="flex gap-4">
            <div>
              <Select
                name="year"
                aria-label="Project status"
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                className="border-2 rounded-md p-2 mr-2"
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
                className="border-2 rounded-md p-2 mr-2"
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
                className="border-2 rounded-md p-2 mr-2"
              >
                <option value="none">선택</option>
                {days.map((day) => (
                  <option value={day} key={day}>
                    {day}
                  </option>
                ))}
              </Select>
              <span>일</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button className="my-2 bg-slate-400 rounded hover:bg-slate-500 py-2 px-8" onClick={handleSelect}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
