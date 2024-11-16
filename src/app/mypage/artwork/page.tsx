"use client";

import React, { useEffect, useState } from "react";
import MyArtwork from "@/components/artwork/MyArtwork";
import MonthlyArtwork from "@/components/artwork/MonthlyArtwork";
import MemoryCollection from "@/components/artwork/MemoryCollection";
import getLoginUser from "@/lib/getLoginUser";
import Navigation from "@/components/Navigation";
import CommonTitle from "@/components/CommonTitle";
import useGetDevice from "@/hooks/useGetDevice";

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
      <CommonTitle title="내 그림 모아보기" />
      <div className="lg:flex justify-center items-center lg:ml-[23px] lg:mt-10">
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
