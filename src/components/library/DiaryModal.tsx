import React, { useEffect, useState, useRef } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary, DiaryModalProps } from "@/types/library/Diary";

import SearchBar from "@/components/library/SearchBar";
import DateDropdown from "@/components/library/DateDropdown";
import DiaryList from "@/components/library/DiaryList";
import SortDropdown from "@/components/library/SortDropdown";

const DiaryModal: React.FC<DiaryModalProps> = ({ onClose, userId, selectedYear, setSelectedDiary }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [filteredDiaries, setFilteredDiaries] = useState<Diary[]>([]);
  const [currentDiary, setCurrentDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [year, setYear] = useState(selectedYear);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(0);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
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

  const parseDate = (dateStr: string) => {
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

        const isSameYear = diaryYear === year;
        const isSameMonth = diaryMonth === month;
        const isSameDay = day === 0 || diaryDay === day;

        const matchesSearch = diary.title.includes(debouncedSearchTerm) || diary.contents.includes(debouncedSearchTerm);

        return isSameYear && isSameMonth && isSameDay && matchesSearch;
      });

      result.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return sort === "newest"
          ? (dateB?.getTime() || 0) - (dateA?.getTime() || 0)
          : (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
      });
      console.log("result=>", result);
      setFilteredDiaries(result);
    };

    filterDiaries();
  }, [diaries, year, month, day, debouncedSearchTerm, sort]);

  const saveDiary = async (diary: Diary) => {
    try {
      const { error } = await browserClient
        .from("users")
        .update({
          main_diary: diary.id
        })
        .eq("id", userId);

      if (error) throw error;
      console.log("일기 저장 성공");
    } catch (error) {
      console.log("일기 저장 실패:", error);
    }
  };

  const handleSelectDiary = (diary: Diary) => {
    setCurrentDiary(diary);
  };

  const handleComplete = async () => {
    if (currentDiary) {
      setSelectedDiary(currentDiary);
      await saveDiary(currentDiary);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className=" bg-white p-6 rounded-lg shadow-md w-full max-w-md h-[80vh]">
        <button className="absolute top-14 right-4 text-black" onClick={onClose}>
          X
        </button>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <DateDropdown year={year} month={month} day={day} setYear={setYear} setMonth={setMonth} setDay={setDay} />
        <SortDropdown currentSort={sort} onSortChange={setSort} />
        <div className="overflow-y-auto max-h-[56vh]">
          <DiaryList
            diaries={filteredDiaries}
            loading={loading}
            userId={userId}
            sort={sort}
            onSelectDiary={handleSelectDiary}
          />
        </div>
        <div className="flex items-center justify-center">
          <button className="my-2 bg-slate-400 rounded hover:bg-slate-500 py-2 px-8" onClick={handleComplete}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
