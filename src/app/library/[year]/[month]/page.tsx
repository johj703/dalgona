"use client";

import React, { useEffect, useState } from "react";
import DiaryContent from "@/components/library/DiaryContent";
import { useParams, useRouter } from "next/navigation";
import browserClient from "@/utils/supabase/client";

const MonthDiaryPage: React.FC = () => {
  const { year, month } = useParams(); // useParams로 year와 month 가져오기
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await browserClient
        .from("users")
        .select("id")
        .eq("id", "c56a4180-65aa-42ec-a945-5fd21dec0538");

      if (error) {
        console.error("Error fetching userId:", error.message);
        setError("유저 정보를 가져오는 데 실패했습니다.");
      } else if (data && data.length > 0) {
        setUserId(data[0].id);
      } else {
        console.log("유저 정보 없음.");
      }
      setLoading(false);
    };

    fetchUserId();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!year || !month || !userId) {
    return <p>연도와 월 또는 사용자 정보를 가져오는 중...</p>;
  }

  return (
    <div className="flex flex-col bg-[#FDF7F4] min-h-screen">
      <div className="flex p-4 h-[52px]">
        <button onClick={() => router.back()}>
          <img src="/icons/arrow-left.svg" alt="Arrow Left" className="w-4 h-4 relative" />
        </button>
        <p className="text-lg font-normal leading-[27px] flex-grow text-center">{month}월</p>
      </div>
      <DiaryContent userId={userId} year={Number(year)} month={Number(month)} />
    </div>
  );
};

export default MonthDiaryPage;
