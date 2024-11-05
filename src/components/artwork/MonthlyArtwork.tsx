"use client";

import React, { useEffect, useState, useRef } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import { useRouter } from "next/navigation";

const MonthlyArtwork: React.FC = () => {
  const [diaryEntries, setDiaryEntries] = useState<Diary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMonthlyArtworks = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 01, 02 형식

      const { data, error } = await browserClient
        .from("diary")
        .select("*")
        .not("draw", "is", null)
        .like("date", `%${year}년 ${month}월%`) // 현재 월에 해당하는 그림 필터링
        .order("date", { ascending: false });

      if (error) {
        console.error("일기 가져오기 실패 =>", error);
      }

      if (data) {
        setDiaryEntries(data);
      }
      setLoading(false);
    };

    fetchMonthlyArtworks();
  }, []);

  const handleSwipe = () => {
    if (touchStartRef.current !== null && touchEndRef.current !== null) {
      const swipeDistance = touchStartRef.current - touchEndRef.current;
      if (swipeDistance > 50) {
        // 다음
        setCurrentIndex((prevIndex) => (prevIndex + 1) % diaryEntries.length);
      } else if (swipeDistance < -50) {
        // 이전
        setCurrentIndex((prevIndex) => (prevIndex - 1 + diaryEntries.length) % diaryEntries.length);
      }
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  // 전체 보기 클릭 핸들러
  const handleViewAllClick = () => {
    const currentMonth = new Date().getMonth() + 1; // 현재 월 (1월은 0이므로 +1)
    router.push(`/gallery/${currentMonth}`); // app/gallery/[month].tsx로 이동
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">이번 달 모음</h2>
        <button onClick={handleViewAllClick} className="text-sm text-blue-500 hover:underline">
          전체 보기
        </button>
      </div>

      <div
        className="relative flex overflow-hidden border rounded-lg"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {loading ? (
          <div className="flex items-center justify-center w-full h-48">
            <span>로딩 중...</span>
          </div>
        ) : diaryEntries.length > 0 ? (
          diaryEntries.map((diary: Diary, index: number) => (
            <div
              key={diary.id}
              className={`flex-shrink-0 w-full transition-transform transform ${
                index === currentIndex ? "translate-x-0" : "hidden"
              }`}
            >
              {diary.draw ? (
                <img src={diary.draw} className="object-cover w-full h-full rounded-lg" alt={`Artwork ${diary.id}`} />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">이미지 없음</div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-48 text-gray-500">이번 달의 그림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MonthlyArtwork;
