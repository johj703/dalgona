"use client";

import React, { useEffect, useState, useRef } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";

const MyArtwork: React.FC = () => {
  const [diaryEntries, setDiaryEntries] = useState<Diary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const touchStartRef = useRef<number | null>(null); // 터치 시작 위치
  const mouseStartRef = useRef<number | null>(null); // 마우스 시작 위치

  useEffect(() => {
    const fetchRandomArtworks = async () => {
      const { data, error } = await browserClient.from("diary").select("*").not("draw", "is", null);

      if (error) {
        console.error("일기 가져오기 실패 =>", error);
      }

      if (data) {
        const randomEntries = data.sort(() => 0.5 - Math.random()).slice(0, 5);
        setDiaryEntries(randomEntries);
      }
      setLoading(false);
    };

    fetchRandomArtworks();
  }, []);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = event.touches[0].clientX; // 터치 시작 위치 저장
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current === null) return;

    const touchEnd = event.touches[0].clientX;
    const touchDiff = touchStartRef.current - touchEnd;

    if (touchDiff > 50) {
      // 오른쪽에서 왼쪽으로 스와이프
      handleNext();
      touchStartRef.current = null; // 리셋
    } else if (touchDiff < -50) {
      // 왼쪽에서 오른쪽으로 스와이프
      handlePrev();
      touchStartRef.current = null; // 리셋
    }
  };

  const handleMouseStart = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseStartRef.current = event.clientX; // 마우스 시작 위치 저장
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mouseStartRef.current === null) return;

    const mouseEnd = event.clientX;
    const mouseDiff = mouseStartRef.current - mouseEnd;

    if (mouseDiff > 50) {
      // 오른쪽에서 왼쪽으로 스와이프
      handleNext();
      mouseStartRef.current = null; // 리셋
    } else if (mouseDiff < -50) {
      // 왼쪽에서 오른쪽으로 스와이프
      handlePrev();
      mouseStartRef.current = null; // 리셋
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % diaryEntries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + diaryEntries.length) % diaryEntries.length);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* <div className="flex items-center justify-between p-4">
        <p className="text-xl font-bold">내 그림 모아보기</p>
      </div> */}

      {/* 슬라이더 영역 */}
      <div
        onTouchStart={handleTouchStart} // 터치 이벤트
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseStart} // 마우스 이벤트
        onMouseMove={handleMouseMove}
        className={`flex items-center justify-center ${loading ? "hidden" : ""}`}
      >
        {diaryEntries.length > 0 ? (
          <div className="relative w-full h-60 overflow-hidden rounded-lg">
            {diaryEntries.map((diary: Diary, index: number) => (
              <div
                key={diary.id}
                className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              >
                {diary.draw ? (
                  <img src={diary.draw} className="rounded-lg h-full w-full object-cover" alt={`Artwork ${diary.id}`} />
                ) : (
                  <span className="text-xl text-white">이미지 없음</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && <span className="text-2xl text-white">슬라이더 콘텐츠</span>
        )}
      </div>

      {/* 인디케이터 */}
      {!loading && diaryEntries.length > 0 && (
        <div className="flex justify-center mb-2">
          {diaryEntries.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 mx-1 rounded-full ${index === currentIndex ? "bg-[#AEAEAE]" : "bg-[#D9D9D9]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyArtwork;
