"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import { useRouter } from "next/navigation";
import getLoginUser from "@/lib/getLoginUser"; // 로그인한 사용자 정보를 가져오는 함수

const GalleryPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const diaryId = searchParams ? searchParams.get("id") : null; // URL에서 ID 가져오기
  const [diaryEntries, setDiaryEntries] = useState<Diary[]>([]);
  const [mainEntry, setMainEntry] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  // 로그인한 사용자의 ID를 가져오는 함수
  const getUserId = async () => {
    const data = await getLoginUser();
    if (data) {
      setUserId(data.id); // 로그인한 사용자 ID를 상태에 설정
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserId(); // getUserId 실행 후 userId 상태 업데이트
  }, []);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (userId) {
        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: true });

        if (error) {
          console.error("다이어리 항목 가져오기 실패 =>", error);
        } else if (data) {
          setDiaryEntries(data);
          if (diaryId) {
            const currentEntry = data.find((entry) => entry.id === diaryId);
            setMainEntry(currentEntry || null);
          }
        }
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [diaryId, userId]); // userId가 변경될 때마다 실행

  const handleSwipeSelect = (entry: Diary) => {
    setMainEntry(entry); // 이미지를 클릭했을 때 메인 이미지로 설정
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF7F4]">
      <div className="flex p-4">
        <button onClick={() => router.back()} className="text-black">
          <img src="/icons/arrow-left.svg" alt="Arrow Left" className="w-4 h-4 relative" />
        </button>
        <p className="text-xl font-bold flex-grow text-center">내 그림 모아보기</p>
      </div>

      {loading ? (
        <span>로딩 중...</span>
      ) : mainEntry ? (
        <div>
          {/* 메인 이미지 표시 */}
          <div className="relative flex items-center justify-center bg-white mb-4 w-full min-h-[531px] overflow-hidden border border-[#D9D9D9] ">
            {mainEntry.draw ? (
              <img src={mainEntry.draw} alt={`Artwork ${mainEntry.id}`} className="w-full border border-[#D9D9D9]" />
            ) : (
              <span>이미지 없음</span>
            )}
          </div>

          {/* 하단의 스와이프 가능한 이미지 리스트 */}
          <div className="py-4">
            <div className="flex overflow-x-auto space-x-2 px-4">
              {diaryEntries.map((entry) => (
                <div key={entry.id} className="flex-shrink-0 w-12 h-12">
                  <img
                    src={entry.draw}
                    alt={`Artwork ${entry.id}`}
                    className={`w-full h-full object-cover cursor-pointer bg-white border border-[#D9D9D9] ${
                      entry.id === mainEntry.id ? "border-2 border-[#D84E35]" : ""
                    }`}
                    onClick={() => handleSwipeSelect(entry)} // 이미지를 클릭하면 메인 이미지 변경
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <span>해당 다이어리 항목을 찾을 수 없습니다.</span>
      )}
    </div>
  );
};

export default GalleryPage;
