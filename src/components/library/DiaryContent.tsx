"use client";

import React, { useEffect, useState } from "react";
import { Diary, DiaryContentProps } from "@/types/library/Diary";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DiaryContent: React.FC<DiaryContentProps> = ({ userId, year, month }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("diary").select("*").eq("user_id", userId);

        if (error) throw error;

        // 날짜 형식 변환 및 필터링
        const filteredDiaries = data?.filter((diary) => {
          const diaryDate = new Date(diary.date.replace(/년|월|일/g, "-").trim());
          return diaryDate.getFullYear() === year && diaryDate.getMonth() + 1 === month;
        });

        console.log("Filtered diaries:", filteredDiaries);
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
          diaries.map((diary) => {
            const { data: imageUrlData } = supabase.storage.from("posts").getPublicUrl(diary.draw);
            console.log(`Diary ID => ${diary.id}, Image URL =>`, imageUrlData?.publicUrl);

            return (
              <div key={diary.id} className="border rounded-lg shadow-md p-4">
                <div className="h-48 bg-gray-200 flex items-center justify-center mb-2">
                  {imageUrlData?.publicUrl ? (
                    <img src={diary.draw} alt="그림" className="object-cover h-full w-full" />
                  ) : (
                    <span className="text-gray-500">그림 없음</span>
                  )}
                </div>
                <h3 className="font-bold text-lg">{diary.title}</h3>
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
