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
        // 다음 (마지막 인덱스에서 더 이상 증가하지 않도록)
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, diaryEntries.length - 1));
      } else if (swipeDistance < -50) {
        // 이전 (첫 번째 인덱스에서 더 이상 감소하지 않도록)
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
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
    <div className="bg-[#FDF7F4] p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-normal font-['Dovemayo_gothic]">이번 달 모음</h2>
        <button onClick={handleViewAllClick} className="text-lg text-[#18778c] hover:underline">
          전체 보기
        </button>
      </div>

      <div className="relative overflow-x-auto flex rounded-lg " onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {loading ? (
          <div className="flex items-center justify-center w-full h-48">
            <span>로딩 중...</span>
          </div>
        ) : diaryEntries.length > 0 ? (
          diaryEntries.map((diary: Diary, index: number) => (
            <div
              key={diary.id}
              className={`flex-shrink-0 w-64 transition-transform duration-700 linear ${
                index === currentIndex || index === currentIndex + 1 ? "translate-x-0" : "hidden"
              }`}
              style={{ marginRight: index !== diaryEntries.length - 1 ? "16px" : "0" }} // 마지막 항목에는 오른쪽 마진 없음
            >
              {diary.draw ? (
                <img
                  src={diary.draw}
                  className="object-cover w-full h-40 border border-[#D9D9D9] rounded-lg"
                  alt={`Artwork ${diary.id}`}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">이미지 없음</div>
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
