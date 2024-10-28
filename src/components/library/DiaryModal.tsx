import React, { useEffect, useState, useRef } from "react";

import { Diary, DiaryModalProps } from "@/types/library/Diary";

import SearchBar from "@/components/library/SearchBar";
import DateDropdown from "@/components/library/DateDropdown";
import DiaryList from "@/components//library/DiaryList";
import browserClient from "@/utils/supabase/client";

const DiaryModal: React.FC<DiaryModalProps> = ({ onClose, userId, selectedYear }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [filteredDiaries, setFilteredDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  // const [day, setDay] = useState(new Date().getDate());
  const [day, setDay] = useState(0);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (userId) {
      fetchUserDiaries(userId);
    }
  }, [userId]);

  const fetchUserDiaries = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await browserClient
        .from("diary")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      setDiaries(data || []);
    } catch (error) {
      console.error("Error fetching diaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseDate = (dateStr: string): Date | null => {
    const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일/;
    const match = dateStr.match(regex);

    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  useEffect(() => {
    const filterDiaries = () => {
      const result = diaries.filter((diary) => {
        const diaryDate = parseDate(diary.date);
        if (!diaryDate) return false;

        const diaryYear = diaryDate.getFullYear();
        const diaryMonth = diaryDate.getMonth() + 1;
        const diaryDay = diaryDate.getDate();

        // 필터링 조건 설정
        const isSameYear = diaryYear === selectedYear;
        const isSameMonth = diaryMonth === month;
        const isSameDay = day === 0 || diaryDay === day; // day가 0이면 해당 월의 모든 일기 표시

        const matchesSearch = diary.title.includes(debouncedSearchTerm) || diary.contents.includes(debouncedSearchTerm);

        return isSameYear && isSameMonth && isSameDay && matchesSearch;
      });

      setFilteredDiaries(result);
    };

    filterDiaries();
  }, [diaries, selectedYear, month, day, debouncedSearchTerm]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className=" bg-white p-6 rounded-lg shadow-md w-full max-w-md h-[80vh]">
        <button className="absolute top-14 right-4 text-black" onClick={onClose}>
          X
        </button>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <DateDropdown month={month} day={day} setMonth={setMonth} setDay={setDay} />
        <div className="overflow-y-auto max-h-[56vh]">
          <DiaryList diaries={filteredDiaries} loading={loading} userId={userId} />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="my-2 bg-slate-400 rounded hover:bg-slate-500 py-2 px-8"
            onClick={() => {
              console.log("완료");
              onClose();
            }}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
