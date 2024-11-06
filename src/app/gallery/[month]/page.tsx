"use client";

import { useEffect, useState } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Params 타입 정의
interface Params {
  month: string;
}

const MonthlyGallery = ({ params }: { params: Params }) => {
  const { month } = params; // URL의 month 매개변수 추출
  const router = useRouter();
  const [artworks, setArtworks] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (month) {
        setLoading(true);
        const monthNumber = parseInt(month, 10); // month를 숫자로 변환
        console.log(monthNumber);

        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .not("draw", "is", null)
          .like("date", `%${monthNumber}월%`);

        if (error) {
          setError("그림 가져오기 실패");
          console.log("그림 가져오기 실패 =>", error);
        }
        console.log("Fetched data:", data);

        if (data && data.length > 0) {
          // 데이터가 존재?
          setArtworks(data);
        } else {
          setArtworks([]); // 데이터가 없으면 빈 배열
        }

        setLoading(false);
      }
    };

    fetchArtworks();
  }, [month]);

  return (
    <div className="flex flex-col h-screen bg-[#FDF7F4]">
      <div className="flex p-4">
        <button onClick={() => router.back()} className="text-black">
          <img src="/icons/arrow-left.svg" alt="Arrow Left" className="w-4 h-4 relative" />
        </button>
        <p className="text-xl font-bold flex-grow text-center">내 그림 모아보기</p>
      </div>
      <h2 className="text-2xl p-4">{month}월</h2>
      {loading ? (
        <div className="text-center">로딩 중...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border border-[#D9D9D9]">
              <Link href={`/artworkprev?id=${artwork.id}`}>
                <img
                  src={artwork.draw}
                  alt={`Artwork ${artwork.id}`}
                  className="w-full  object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">그 달의 그림이 없습니다.</div>
      )}
    </div>
  );
};

export default MonthlyGallery;
