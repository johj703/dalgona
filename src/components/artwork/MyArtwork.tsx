"use client";

import React, { useEffect, useState, useRef } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary, MyArtworkProps } from "@/types/library/Diary";
import { useRouter } from "next/navigation";

const MyArtwork: React.FC<MyArtworkProps> = ({ userId }) => {
  const [diaryEntries, setDiaryEntries] = useState<Diary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartRef = useRef<number | null>(null);
  const mouseStartRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomArtworks = async () => {
      const { data, error } = await browserClient
        .from("diary")
        .select("*")
        .not("draw", "is", null)
        .eq("user_id", userId);

      if (error) {
        console.error("일기 가져오기 실패 =>", error);
      }

      if (data) {
        const randomEntries = data.sort(() => 0.5 - Math.random()).slice(0, 5);
        setDiaryEntries(randomEntries);
      }
      setLoading(false);
    };

    if (userId) {
      fetchRandomArtworks();
    }
  }, [userId]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current === null) return;

    const touchEnd = event.touches[0].clientX;
    const touchDiff = touchStartRef.current - touchEnd;

    if (touchDiff > 50) {
      handleNext();
      touchStartRef.current = null;
    } else if (touchDiff < -50) {
      handlePrev();
      touchStartRef.current = null;
    }
  };

  const handleMouseStart = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseStartRef.current = event.clientX;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mouseStartRef.current === null) return;

    const mouseEnd = event.clientX;
    const mouseDiff = mouseStartRef.current - mouseEnd;

    if (mouseDiff > 50) {
      handleNext();
      mouseStartRef.current = null;
    } else if (mouseDiff < -50) {
      handlePrev();
      mouseStartRef.current = null;
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % diaryEntries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + diaryEntries.length) % diaryEntries.length);
  };

  const handleViewGallery = () => {
    const diaryId = diaryEntries[currentIndex]?.id; // 현재 인덱스에 해당하는 다이어리 ID 가져오기
    if (diaryId) {
      router.push(`/artworkprev?id=${diaryId}&userId=${userId}`); // userId를 쿼리 파라미터로 전달
    }
  };

  return (
    <div className="flex flex-col bg-[#FDF7F4]">
      <div className="flex p-4">
        <button>
          <img src="/icons/arrow-left.svg" alt="Arrow Left" className="w-4 h-4 relative" />
        </button>
        <p className="text-lg font-normal leading-[27px] flex-grow text-center">내 그림 모아보기</p>
      </div>

      {/* 슬라이더 영역 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseStart}
        onMouseMove={handleMouseMove}
        className={`pb-4 relative flex items-center justify-center ${loading ? "hidden" : ""}`}
      >
        {diaryEntries.length > 0 ? (
          <div className="relative w-full h-[490px] overflow-hidden border-2 border-[#D9D99]">
            {diaryEntries.map((diary: Diary, index: number) => (
              <div
                key={diary.id}
                className={`absolute inset-0 transition-opacity duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              >
                {diary.draw ? (
                  <img src={diary.draw} className="h-full w-full object-cover" alt={`Artwork ${diary.id}`} />
                ) : (
                  <span className="text-xl text-white">이미지 없음</span>
                )}
              </div>
            ))}

            {/* 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {diaryEntries.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-[#AEAEAE]" : "bg-[#D9D9D9]"}`}
                />
              ))}
            </div>
          </div>
        ) : (
          !loading && <span className="text-2xl text-white">슬라이더 콘텐츠</span>
        )}

        {/* 보러가기 버튼 */}
        <button
          onClick={handleViewGallery}
          className="absolute bottom-12 right-4 bg-[#D9D9D9] text-black text-sm px-4 py-2 rounded-full"
        >
          보러가기
        </button>
      </div>
    </div>
  );
};

export default MyArtwork;
