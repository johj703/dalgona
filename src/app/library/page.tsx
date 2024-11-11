"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CommonTitle from "@/components/CommonTitle";
import YearSelector from "@/components/library/YearSelector";
import DiaryReminder from "@/components/library/DiaryReminder";
import MonthSelector from "@/components/library/MonthSelector";
import getLoginUser from "@/lib/getLoginUser";

const LibraryPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [userId, setUserId] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 연도 쿼리 파라미터 가져오기 및 사용자 ID 설정
  useEffect(() => {
    const initializeData = async () => {
      try {
        const yearParam = searchParams.get("year");
        if (yearParam) {
          setSelectedYear(parseInt(yearParam, 10));
        }

        await getUserId();
      } catch (error) {
        console.error("user ID =>", error);
        setError("유저 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [searchParams]);

  // 유저 ID 가져오는 함수
  const getUserId = async () => {
    try {
      const data = await getLoginUser();
      if (data) {
        setUserId(data.id);
      } else {
        setError("유저 정보를 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("getUserId =>", error);
      setError("유저 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  // 연도 변경 시 URL 쿼리 파라미터 업데이트
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    router.push(`?year=${year}`);
    console.log("선택 연도 =>", year);
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-background02">
      <CommonTitle title="기록의 방" />
      <div className="p-4 flex flex-col">
        <YearSelector currentYear={currentYear} selectedYear={selectedYear} onYearChange={handleYearChange} />
        {userId ? (
          <DiaryReminder userId={userId} selectedYear={selectedYear} />
        ) : (
          <p>유저 정보를 불러오지 못했습니다.</p>
        )}
        <MonthSelector year={selectedYear} />
      </div>
    </div>
  );
};

export default LibraryPage;
