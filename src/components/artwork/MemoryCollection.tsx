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
        // 다음 (마지막 인덱스일 때 증가하지 않도록)
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, selectedEntries.length - 1));
      } else if (swipeDistance < -50) {
        // 이전 (첫 번째 인덱스에서 돌아가지 않도록)
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

  return (
    <div className="bg-[#FDF7F4] rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-normal">추억 모음</h2>
        <button onClick={() => router.push("/gallery")} className="text-lg text-[#18778c] hover:underline">
          전체 보기
        </button>
      </div>

      <div className="relative overflow-x-auto flex rounded-lg" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
              className={`flex-shrink-0 w-64 transition-transform duration-700 linear ${
                index === currentIndex || index === currentIndex + 1 ? "translate-x-0" : "hidden"
              }`}
              style={{ marginRight: index !== selectedEntries.length - 1 ? "16px" : "0" }}
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
          <div className="flex items-center justify-center w-full h-48 text-gray-500">불러올 그림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MemoryCollection;
