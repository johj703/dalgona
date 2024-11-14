"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary, MonthlyArtworkProps } from "@/types/library/Diary";
import { useRouter } from "next/navigation";

const MonthlyArtwork: React.FC<MonthlyArtworkProps> = ({ userId }) => {
  const [diaryEntries, setDiaryEntries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMonthlyArtworks = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 01, 02 형식

      const { data, error } = await browserClient
        .from("diary")
        .select("*")
        .eq("user_id", userId) // userId로 필터링
        .not("draw", "is", null)
        .like("date", `%${year}년 ${month}월%`) // 현재 월에 해당하는 그림 필터링
        .order("date", { ascending: false });

      if (error) {
        console.error("일기 가져오기 실패 =>", error);
      }

      if (data) {
        const shuffledEntries = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setDiaryEntries(shuffledEntries);
      }
      setLoading(false);
    };

    fetchMonthlyArtworks();
  }, [userId]);

  // > 클릭 핸들러
  const handleViewAllClick = () => {
    const currentMonth = new Date().getMonth() + 1; // 현재 월 (1월은 0이므로 +1)
    router.push(`/gallery/${currentMonth}`);
  };

  return (
    <div className="bg-[#FDF7F4] p-4">
      <div className="flex justify-items-start gap-4 items-center mb-4">
        <h2 className="text-xl font-normal">이번 달 모음</h2>
        <button onClick={handleViewAllClick}>
          <img src="/icons/arrow-right.svg" alt="Go to Gallery" />
        </button>
      </div>

      <div className="relative overflow-x-auto flex rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center w-full h-48">
            <span>로딩 중...</span>
          </div>
        ) : diaryEntries.length > 0 ? (
          diaryEntries.map((diary: Diary, index: number) => (
            <div
              key={diary.id}
              className="flex-shrink-0 w-64 transition-transform duration-700 linear"
              style={{ marginRight: index !== diaryEntries.length - 1 ? "16px" : "0" }} // 마지막 항목에는 오른쪽 마진 없음
            >
              {diary.draw ? (
                <img
                  src={diary.draw}
                  className="object-cover w-full h-40 border bg-white border-[#D9D9D9] rounded-lg"
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
