"use client";

import React, { useEffect, useState } from "react";
import YearSelector from "@/components/library/YearSelector";
import DiaryReminder from "@/components/library/DiaryReminder";
import { createClient } from "@supabase/supabase-js";

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LibraryPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const fetchUserId = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("users").select("id").limit(1); // 더미 데이터에서 사용자의 user_id 가져오기

    if (error) {
      console.error("Error fetching userId:", error.message);
      setError("유저 정보를 가져오는 데 실패했습니다.");
    } else if (data && data.length > 0) {
      console.log(data);
      setUserId(data[0].id);
    } else {
      console.log("유저 정보 없음.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    console.log(year);
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <YearSelector currentYear={currentYear} onYearChange={handleYearChange} />
      {userId ? <DiaryReminder userId={userId} selectedYear={selectedYear} /> : <p>유저 정보를 불러오지 못했습니다.</p>}
    </div>
  );
};

export default LibraryPage;
