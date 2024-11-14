"use client";

import { useEffect, useState } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import Link from "next/link";
import getLoginUser from "@/lib/getLoginUser";
import CommonTitle from "@/components/CommonTitle";

// Params 타입
interface Params {
  month: string;
}

const MonthlyGallery = ({ params }: { params: Params }) => {
  const { month } = params;
  const [artworks, setArtworks] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const userdata = await getLoginUser();

        if (!userdata) {
          setError("로그인 정보가 없습니다.");
          setLoading(false);
          return;
        }

        setLoading(true);
        const monthNumber = parseInt(month, 10); // month를 숫자로 변환

        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .not("draw", "is", null)
          .like("date", `%${monthNumber}월%`)
          .eq("user_id", userdata.id);

        if (error) {
          setError("그림 가져오기 실패");
          console.error("그림 가져오기 실패 =>", error);
        } else if (data && data.length > 0) {
          setArtworks(data);
        } else {
          setArtworks([]); // 데이터가 없으면 빈 배열
        }
      } catch (err) {
        console.error(err);
        setError("그림을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [month]);

  return (
    <div className="flex flex-col h-screen bg-[#FDF7F4]">
      <CommonTitle title="내 그림 모아보기" />
      <h2 className="text-2xl p-4">{month}월</h2>
      {loading ? (
        <div className="text-center">로딩 중...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border border-[#D9D9D9] aspect-square overflow-hidden">
              <Link href={`/artworkprev?id=${artwork.id}`}>
                <img
                  src={artwork.draw}
                  alt={`Artwork ${artwork.id}`}
                  className="w-full h-full object-cover cursor-pointer bg-white"
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
