"use client";

import React, { useEffect, useState } from "react";
import DiaryContent from "@/components/library/DiaryContent";
import { useParams } from "next/navigation";
import getLoginUser from "@/lib/getLoginUser";
import CommonTitle from "@/components/CommonTitle";
import Navigation from "@/components/Navigation";
import useGetDevice from "@/hooks/useGetDevice";

const MonthDiaryPage: React.FC = () => {
  const { year, month } = useParams();
  // const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const device = useGetDevice();

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
    <div className="bg-background02 ">
      <CommonTitle title={`${month}월`} />
      <div className="flex flex-col bg-[#FDF7F4] max-w-sm m-auto lg:max-w-screen-lg">
        <DiaryContent userId={userId} year={Number(year)} month={Number(month)} />
        {device === "mobile" && <Navigation />}
      </div>
    </div>
  );
};

export default MonthDiaryPage;
