"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import Link from "next/link";
import getLoginUser from "@/lib/getLoginUser";
import CommonTitle from "@/components/CommonTitle";
import useGetDevice from "@/hooks/useGetDevice";
import Header from "@/components/layout/Header";

const ArtworkGallery: React.FC = () => {
  const device = useGetDevice();
  const [artworks, setArtworks] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllArtworks = async () => {
      try {
        const userdata = await getLoginUser();

        if (!userdata) {
          setError("로그인 정보가 없습니다.");
          setLoading(false);
          return;
        }

        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .not("draw", "is", null)
          .order("created_at", { ascending: false }) // 최신순 정렬
          .eq("user_id", userdata.id);

        if (error) {
          throw new Error("그림 가져오기 실패");
        }

        if (data) {
          setArtworks(data); // 모든 그림 데이터를 상태에 저장
        }
      } catch (err) {
        console.error(err);
        setError("그림을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtworks();
  }, []);

  return (
    <div className="flex flex-col bg-[#FDF7F4]">
      {device === "pc" ? <Header /> : <CommonTitle title={"내 그림 모아보기"} />}
      <h2 className="text-2xl p-4 lg:text-center">추억모음</h2>
      {loading ? (
        <div className="flex items-center justify-center w-full h-48">
          <span>로딩 중...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center w-full h-48 text-red-500">{error}</div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 px-4 pb-24">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="border border-[#D9D9D9] aspect-square overflow-hidden rounded-[4px] lg:rounded-2xl"
            >
              <Link href={`/artworkprev?id=${artwork.id}`}>
                <img src={artwork.draw} alt={`Artwork ${artwork.id}`} className="w-full h-full object-cover bg-white" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-48 text-gray-500">불러올 그림이 없습니다.</div>
      )}
    </div>
  );
};

export default ArtworkGallery;
