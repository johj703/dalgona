"use client";

import React, { useEffect, useState } from "react";
import DiaryContent from "@/components/library/DiaryContent";
import { createClient } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MonthDiaryPage: React.FC = () => {
  const { year, month } = useParams(); // useParams로 year와 month 가져오기
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await supabase.from("users").select("id").limit(1);

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
    <div className="container mx-auto p-4">
      <button onClick={() => router.back()} className="mr-2 text-blue-500 hover:text-blue-700">
        ◀
      </button>
      <h1 className="text-2xl font-semibold mb-4 text-center">{month}월</h1>
      <p className="text-center mb-2">이곳은 {month}월의 나를 담은 방이에요.</p>
      <p className="text-center mb-6">이렇게 많은 순간들을 기억에 남겼어요!</p>
      <DiaryContent userId={userId} year={Number(year)} month={Number(month)} />
    </div>
  );
};

export default MonthDiaryPage;
