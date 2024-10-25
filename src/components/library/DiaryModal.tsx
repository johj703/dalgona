import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Diary, DiaryModalProps } from "@/types/library/Diary";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DiaryModal: React.FC<DiaryModalProps> = ({ onClose, userId, selectedYear }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // 커스텀 드롭다운 상태
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

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
      const { data, error } = await supabase
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

  const filteredDiaries = diaries.filter((diary) => {
    const diaryDate = parseDate(diary.date);
    if (!diaryDate) return false;

    const diaryYear = diaryDate.getFullYear();
    const diaryMonth = diaryDate.getMonth() + 1;
    const diaryDay = diaryDate.getDate();

    return (
      diaryYear === selectedYear &&
      diaryMonth === month &&
      diaryDay === day &&
      diary.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  });

  // 드롭다운 핸들러
  const toggleMonthDropdown = () => {
    setIsMonthOpen(!isMonthOpen);
    if (isDayOpen) {
      setIsDayOpen(false); // 일 드롭다운 닫기
    }
  };

  const toggleDayDropdown = () => {
    setIsDayOpen(!isDayOpen);
    if (isMonthOpen) {
      setIsMonthOpen(false); // 월 드롭다운 닫기
    }
  };

  const handleMonthChange = (selectedMonth: number) => {
    setMonth(selectedMonth);
    setIsMonthOpen(false);
    setIsDayOpen(false); // 선택 후 일 드롭다운 닫기
  };

  const handleDayChange = (selectedDay: number) => {
    setDay(selectedDay);
    setIsDayOpen(false);
    setIsMonthOpen(false); // 선택 후 월 드롭다운 닫기
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 p-5 rounded shadow-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          X
        </button>

        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        />

        {/* 월, 일 선택 커스텀 드롭다운 */}
        <div className="flex mb-4">
          <div className="relative">
            <div className="flex items-center pt-4 pl-4">
              <span className="text-lg font-normal">{month}월</span>
              <button
                onClick={toggleMonthDropdown}
                className="ml-1 py-1 text-sm rounded focus:outline-none"
                aria-expanded={isMonthOpen}
              >
                ▼
              </button>
            </div>
            {isMonthOpen && (
              <ul className="absolute z-10 rounded border ml-4 bg-white max-h-40 overflow-y-auto">
                {months.map((m) => (
                  <li
                    key={m}
                    onClick={() => handleMonthChange(m)}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    {m}월
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative ml-2">
            <div className="flex items-center pt-4 pl-4">
              <span className="text-lg font-normal">{day}일</span>
              <button
                onClick={toggleDayDropdown}
                className="ml-1 py-1 text-sm rounded focus:outline-none"
                aria-expanded={isDayOpen}
              >
                ▼
              </button>
            </div>
            {isDayOpen && (
              <ul className="absolute z-10 rounded border ml-4 bg-white max-h-40 overflow-y-auto">
                {days.map((d) => (
                  <li
                    key={d}
                    onClick={() => handleDayChange(d)}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    {d}일
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 일기 목록 */}
        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <p>Loading...</p>
          ) : filteredDiaries.length > 0 ? (
            filteredDiaries.map((diary) => (
              <div key={`${diary.id}-${userId}`} className="border-b py-2 flex items-center">
                <input type="checkbox" className="mr-2" />
                <div>
                  <h3 className="text-xl font-bold">{diary.title}</h3>
                  <p>{diary.contents}</p>
                  <span className="text-gray-500 text-sm">{diary.date}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No diaries found for selected date.</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryModal;
