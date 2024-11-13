"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/utils/supabase/client";
import { Diary, MemoryCollectionProps } from "@/types/library/Diary";
import { useRouter } from "next/navigation";

const MemoryCollection: React.FC<MemoryCollectionProps> = ({ userId }) => {
  const [selectedEntries, setSelectedEntries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAllArtworks = async () => {
      try {
        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .not("draw", "is", null)
          .eq("user_id", userId); // 로그인한 사용자 ID에 맞는 데이터만 필터링

        if (error) {
          throw new Error("그림 가져오기 실패");
        }

        if (data) {
          // 그림을 랜덤하게 섞고 3개 선택
          const shuffledEntries = data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setSelectedEntries(shuffledEntries);
        }
      } catch (err) {
        console.error(err);
        setError("그림을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtworks();
  }, [userId]); // userId가 변경될 때마다 호출

  return (
    <div className="bg-[#FDF7F4] rounded-lg p-4">
      <div className="flex justify-items-start gap-4 items-center mb-4">
        <h2 className="text-xl font-normal">추억 모음</h2>
        <button onClick={() => router.push("/gallery")}>
          <img src="/icons/arrow-right.svg" alt="Go to Gallery" />
        </button>
      </div>

      <div className="relative overflow-x-auto flex rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center w-full h-48">
            <span>로딩 중...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full h-48 text-red-500">{error}</div>
        ) : selectedEntries.length > 0 ? (
          selectedEntries.map((diary: Diary, index: number) => (
            <div
              key={diary.id}
              className="flex-shrink-0 w-64 transition-transform duration-700 linear"
              style={{ marginRight: index !== selectedEntries.length - 1 ? "16px" : "0" }}
            >
              {diary.draw ? (
                <img
                  src={diary.draw}
                  className="object-cover w-full h-40 border bg-white border-[#D9D9D9] rounded-lg"
                  alt={`Artwork ${diary.id}`}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">이미지 없음</div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-48 text-gray-500">불러올 그림이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MemoryCollection;
