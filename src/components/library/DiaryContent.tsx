"use client";

import React, { useEffect, useState } from "react";
import { Diary, DiaryContentProps } from "@/types/library/Diary";
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

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {diaries.length > 0 ? (
          diaries.map((diary: Diary) => {
            const { data: imageUrlData } = browserClient.storage.from("posts").getPublicUrl(diary.draw);
            const diaryDate = parseDate(diary.date);
            const formattedDate = diaryDate
              ? diaryDate.toLocaleDateString("ko-KR", { day: "numeric" })
              : "날짜 정보 없음";

            return (
              <div key={diary.id} className="border rounded-lg shadow-md p-4">
                {imageUrlData?.publicUrl && (
                  <div className="h-48 bg-gray-200 flex items-center justify-center mb-2">
                    <img src={diary.draw} alt="그림" className="object-cover h-full w-full" />
                  </div>
                )}
                <h3 className="font-bold text-lg">{diary.title}</h3>
                <p className="text-sm text-gray-500">{formattedDate}</p>
                <p className="text-gray-700">{diary.contents}</p>
                <p className="mt-2 text-gray-600">감정: {diary.emotion || "없음"}</p>
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
