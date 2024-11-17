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

        // 검색어가 있을 때는 선택된 연도의 모든 일기를 필터링, 날짜는 무시하고 검색어로 필터링
        if (debouncedSearchTerm) {
          const matchesSearch =
            diary.title.includes(debouncedSearchTerm) || diary.contents.includes(debouncedSearchTerm);
          return isSameYear && matchesSearch;
        }

        // 검색어가 없을 때는 연도, 월, 일 조건으로 필터링
        return isSameYear && isSameMonth && isSameDay;
      });

      result.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return sort === "newest"
          ? (dateB?.getTime() || 0) - (dateA?.getTime() || 0)
          : (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
      });
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
      <div className="bg-background02 p-4 w-[342px] h-[654px] rounded-lg relative max-w-sm lg:w-[441px] lg:h-[748px] lg:border lg:border-black lg:max-w-lg flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[18px] font-medium flex-grow text-center">일기 등록하기</h2>
          <button className="text-black lg:hidden" onClick={onClose}>
            <img src="/icons/close-small.svg" alt="close" />
          </button>
        </div>

        {/* 검색바 및 정렬 */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <DateDropdown year={year} month={month} day={day} setYear={setYear} setMonth={setMonth} setDay={setDay} />
        <SortDropdown currentSort={sort} onSortChange={setSort} />

        {/* 스크롤 가능한 영역 */}
        <div className="overflow-y-auto flex-grow">
          <DiaryList
            diaries={filteredDiaries}
            loading={loading}
            userId={userId}
            sort={sort}
            onSelectDiary={handleSelectDiary}
          />
        </div>

        <div className="flex items-center justify-center mt-4 space-x-4">
          {/* 1024px 이상에서만 닫기 버튼 */}
          <button
            className="hidden lg:inline-block border border-primary bg-white rounded-lg py-2 px-4 text-primary w-44"
            onClick={onClose}
          >
            닫기
          </button>

          <button className="bg-primary w-full rounded-lg py-2 px-8 text-white lg:w-44" onClick={handleComplete}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
