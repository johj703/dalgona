"use client";

import React, { useEffect, useState } from "react";
import DiaryContent from "@/components/library/DiaryContent";
import { useParams, useRouter } from "next/navigation";
import getLoginUser from "@/lib/getLoginUser";

const MonthDiaryPage: React.FC = () => {
  const { year, month } = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 ID를 가져오는 함수
  const getUserId = async () => {
    try {
      const data = await getLoginUser();
      if (data) {
        setUserId(data.id);
      } else {
        setError("사용자 정보를 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("login =>", error);
      setError("로그인 정보 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!year || !month || !userId) {
    return <p>유효한 연도와 월 또는 사용자 정보를 확인 중입니다...</p>;
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
