"use client";

import React, { useEffect, useState } from "react";
import MyArtwork from "@/components/artwork/MyArtwork";
import MonthlyArtwork from "@/components/artwork/MonthlyArtwork";
import MemoryCollection from "@/components/artwork/MemoryCollection";
import getLoginUser from "@/lib/getLoginUser";
import Navigation from "@/components/Navigation";
import CommonTitle from "@/components/CommonTitle";
import useGetDevice from "@/hooks/useGetDevice";
import Header from "@/components/layout/Header";

const ArtworkPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const device = useGetDevice();

  useEffect(() => {
    const fetchUserId = async () => {
      const userData = await getLoginUser();
      if (userData) {
        setUserId(userData.id);
      }
    };

    fetchUserId();
  }, []);

  if (!userId) {
    return <p>로그인 정보 로드 중...</p>;
  }

  return (
    <div className="lg:max-w-screen-lg m-auto">
      {device === "pc" ? <Header /> : <CommonTitle title={"내 그림 모아보기"} />}
      <div className="lg:flex items-center lg:ml-[16px]">
        <MyArtwork userId={userId} />
        <div className="lg:w-1/2 overflow-hidden">
          <MonthlyArtwork userId={userId} />
          <MemoryCollection userId={userId} />
        </div>
      </div>
      {device === "mobile" && <Navigation />}
    </div>
  );
};

export default ArtworkPage;
