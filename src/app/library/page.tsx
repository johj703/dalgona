"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import YearSelector from "@/components/library/YearSelector";
import DiaryReminder from "@/components/library/DiaryReminder";
import MonthSelector from "@/components/library/MonthSelector";
import browserClient from "@/utils/supabase/client";

const LibraryPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 연도 쿼리 파라미터를 가져와서 상태를 초기화
  useEffect(() => {
    const yearParam = searchParams.get("year");
    if (yearParam) {
      setSelectedYear(parseInt(yearParam, 10));
    }
    fetchUserId();
  }, [searchParams]);

  // 유저 아이디 가져오기 함수
  const fetchUserId = async () => {
    setLoading(true);

    const { data, error } = await browserClient.from("users").select("id").limit(1);

    if (error) {
      console.error("Error fetching userId:", error.message);
      setError("유저 정보를 가져오는 데 실패했습니다.");
    } else if (data && data.length > 0) {
      setUserId(data[0].id);
    }
    setLoading(false);
  };

  // 연도 변경 시 상태 업데이트 및 URL 쿼리 파라미터 수정
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
    <div>
      <YearSelector currentYear={currentYear} selectedYear={selectedYear} onYearChange={handleYearChange} />
      {userId ? <DiaryReminder userId={userId} selectedYear={selectedYear} /> : <p>유저 정보를 불러오지 못했습니다.</p>}
      <MonthSelector year={selectedYear} />
    </div>
  );
};

export default LibraryPage;
