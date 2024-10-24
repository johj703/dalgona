import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Diary, DiaryModalProps } from "@/types/Diary";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DiaryModal: React.FC<DiaryModalProps> = ({ onClose, userId }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
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

  // 일기 데이터를 가져오는 함수
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

  // 날짜 형식을 "yyyy년 mm월 dd일"에서 Date 객체로 변환하는 함수
  const parseDate = (dateStr: string): Date | null => {
    const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일/;
    const match = dateStr.match(regex);

    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // JavaScript에서는 월이 0부터 시작
      const day = parseInt(match[3], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  // 선택한 월과 일에 맞는 일기를 필터링
  const filteredDiaries = diaries.filter((diary) => {
    const diaryDate = parseDate(diary.date); // date 필드 파싱
    if (!diaryDate) return false; // 날짜 형식이 올바르지 않으면 제외

    const diaryMonth = diaryDate.getMonth() + 1;
    const diaryDay = diaryDate.getDate();

    return (
      diaryMonth === month && diaryDay === day && diary.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 p-5 rounded shadow-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          X
        </button>

        {/* 검색 바 */}
        <input
          type="text"
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        />

        {/* 월, 일 선택 */}
        <div className="flex mb-4">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border rounded p-2 ml-2">
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}월
              </option>
            ))}
          </select>
          <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="border rounded p-2 ml-2">
            {[...Array(31)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}일
              </option>
            ))}
          </select>
        </div>

        {/* 일기 목록 */}
        <div className="max-h-60 overflow-y-auto">
          {loading ? (
            <p>Loading...</p>
          ) : filteredDiaries.length > 0 ? (
            filteredDiaries.map((diary) => (
              <div key={diary.diary_id} className="border-b py-2 flex items-center">
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
