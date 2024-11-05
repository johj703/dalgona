"use client";

import { useEffect, useState } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import Link from "next/link";

// Params 타입 정의
interface Params {
  month: string;
}

const MonthlyGallery = ({ params }: { params: Params }) => {
  const { month } = params; // URL의 month 매개변수 추출
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
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-bold">{month}월의 그림</h2>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : artworks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="border rounded-lg overflow-hidden">
              <Link href={`/artworkprev?id=${artwork.id}`}>
                {" "}
                {/* Link 컴포넌트 추가 */}
                <img
                  src={artwork.draw}
                  alt={`Artwork ${artwork.id}`}
                  className="w-full h-auto object-cover cursor-pointer"
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div>그 달의 그림이 없습니다.</div>
      )}
    </div>
  );
};

export default MonthlyGallery;
