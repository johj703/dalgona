"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ArtworkGallery: React.FC = () => {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllArtworks = async () => {
      try {
        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .not("draw", "is", null)
          .order("created_at", { ascending: false }); // 최신순 정렬

        if (error) {
          throw new Error("그림 가져오기 실패");
        }

        if (data) {
          setArtworks(data); // 모든 그림 데이터를 상태에 저장
        }
      } catch (err) {
        console.error(err);
        setError("그림을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtworks();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#FDF7F4]">
      <div className="flex p-4">
        <button onClick={() => router.back()} className="text-black">
          <img src="/icons/arrow-left.svg" alt="Arrow Left" className="w-4 h-4 relative" />
        </button>
        <p className="text-xl font-bold flex-grow text-center">내 그림 모아보기</p>
      </div>
      <h2 className="text-2xl p-4">전체</h2>
      {loading ? (
        <div className="flex items-center justify-center w-full h-48">
          <span>로딩 중...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center w-full h-48 text-red-500">{error}</div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border rounded-lg overflow-hidden">
              <Link href={`/artworkprev?id=${artwork.id}`}>
                <img src={artwork.draw} alt={`Artwork ${artwork.id}`} className="w-full h-auto object-cover" />
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
