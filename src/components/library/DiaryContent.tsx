"use client";

import React, { useEffect, useState } from "react";
import { Diary, DiaryContentProps } from "@/types/library/Diary";
import { getEmoji } from "@/utils/diary/getEmoji";
import browserClient from "@/utils/supabase/client";

const parseDate = (dateStr: string): Date | null => {
  const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일/;
  const match = dateStr.match(regex);

  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 월은 0부터 시작하므로 1을 뺌
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return null;
};

const DiaryContent: React.FC<DiaryContentProps> = ({ userId, year, month }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const { data, error } = await browserClient.from("diary").select("*").eq("user_id", userId);
        if (error) throw error;

        const filteredDiaries = data
          ?.filter((diary: Diary) => {
            const diaryDate = parseDate(diary.date);
            return diaryDate?.getFullYear() === year && diaryDate?.getMonth() + 1 === month;
          })
          .sort((a: Diary, b: Diary) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
          });

        setDiaries(filteredDiaries || []);
      } catch (error) {
        console.error("Error fetching diaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [userId, year, month]);

  if (loading) return <p className="text-center">로딩 중...</p>;

  return (
    <div className="flex flex-col p-4 min-h-screen bg-[#FDF7F4]">
      <div className="border border-black rounded-lg p-4 mb-4 bg-white">
        <p className="text-center font-bold">나만의 {month}월이 완성되어 가고 있어요! 많은 날들이 일기로 남았어요.</p>
      </div>
      <div className="space-y-4 border rounded-lg p-4 bg-[#EFE6DE]">
        {diaries.length > 0 ? (
          diaries.map((diary: Diary) => {
            const diaryDate = parseDate(diary.date);
            const formattedDate = diaryDate
              ? diaryDate.toLocaleDateString("ko-KR", { day: "numeric" })
              : "날짜 정보 없음";

            return (
              <div key={diary.id} className="border rounded-lg bg-[#FDF7F4] border-black p-4">
                {diary.draw && (
                  <div className="relative h-48 border border-black flex items-center justify-center mb-2 rounded-lg overflow-hidden">
                    <img src={diary.draw} alt="그림" className="object-cover h-full w-full" />
                    <div className="absolute top-2 right-2 flex flex-col items-center">
                      {diary.emotion && (
                        <img src={getEmoji(diary.emotion, "on")} alt={diary.emotion} className="w-10 h-10" />
                      )}
                      <span className="mt-1 w-12 h-6 text-xs py-1 justify-center items-center inline-flex bg-white border border-black rounded-2xl text-black">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{diary.title}</h3>
                  {!diary.draw && (
                    <span className="w-12 h-6 text-xs py-1 justify-center items-center inline-flex bg-white border border-black rounded-2xl text-black">
                      {formattedDate}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 line-clamp-2">{diary.contents}</p>
              </div>
            );
          })
        ) : (
          <p className="text-center">{month}월에는 작성된 일기가 없습니다.</p>
        )}
      </div>
    </div>
  );
};
export default DiaryContent;
