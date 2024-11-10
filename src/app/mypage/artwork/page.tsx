"use client";

import React, { useEffect, useState } from "react";
import MyArtwork from "@/components/artwork/MyArtwork";
import MonthlyArtwork from "@/components/artwork/MonthlyArtwork";
import MemoryCollection from "@/components/artwork/MemoryCollection";
import getLoginUser from "@/lib/getLoginUser";

const ArtworkPage: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

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
    <div>
      <MyArtwork userId={userId} />
      <MonthlyArtwork userId={userId} />
      <MemoryCollection userId={userId} />
    </div>
  );
};

export default ArtworkPage;
