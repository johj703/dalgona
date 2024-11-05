"use client";

import React, { useEffect, useState, useRef } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import { useRouter } from "next/navigation";

const MemoryCollection: React.FC = () => {
  const [selectedEntries, setSelectedEntries] = useState<Diary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllArtworks = async () => {
      try {
        const { data, error } = await browserClient.from("diary").select("*").not("draw", "is", null);

        if (error) {
          throw new Error("그림 가져오기 실패");
        }

        if (data) {
          // 그림을 랜덤하게 섞고 3개 선택
          const shuffledEntries = data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setSelectedEntries(shuffledEntries);
        }
      } catch (err) {
        console.error(err);
        setError("그림을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtworks();
  }, []);

  const handleSwipe = () => {
    if (touchStartRef.current !== null && touchEndRef.current !== null) {
      const swipeDistance = touchStartRef.current - touchEndRef.current;
      if (swipeDistance > 50) {
        // 다음
        setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedEntries.length);
      } else if (swipeDistance < -50) {
        // 이전
        setCurrentIndex((prevIndex) => (prevIndex - 1 + selectedEntries.length) % selectedEntries.length);
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">추억 모음</h2>
        <button onClick={() => router.push("/gallery")} className="text-sm text-blue-500 hover:underline">
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
        ) : error ? (
          <div className="flex items-center justify-center w-full h-48 text-red-500">{error}</div>
        ) : selectedEntries.length > 0 ? (
          selectedEntries.map((diary: Diary, index: number) => (
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
          <div className="flex items-center justify-center w-full h-48 text-gray-500">불러올 그림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MemoryCollection;
