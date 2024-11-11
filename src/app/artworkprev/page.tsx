"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import getLoginUser from "@/lib/getLoginUser";
import CommonTitle from "@/components/CommonTitle";
import { useRouter } from "next/navigation";

const GalleryPage = () => {
  const searchParams = useSearchParams();
  const diaryId = searchParams ? searchParams.get("id") : null;
  const [diaryEntries, setDiaryEntries] = useState<Diary[]>([]);
  const [mainEntry, setMainEntry] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  const imageListRef = useRef<HTMLDivElement | null>(null);

  // 로그인한 사용자의 ID를 가져오는 함수
  const getUserId = async () => {
    const data = await getLoginUser();
    if (data) {
      setUserId(data.id);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (userId) {
        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .eq("user_id", userId)
          .not("draw", "is", null)
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
  }, [diaryId, userId]);

  const handleSwipeSelect = (entry: Diary) => {
    setMainEntry(entry);

    if (imageListRef.current) {
      const container = imageListRef.current;
      const selectedImageElement = document.getElementById(`image-${entry.id}`);

      if (selectedImageElement) {
        const containerWidth = container.offsetWidth;
        const imageWidth = selectedImageElement.offsetWidth;
        const imageOffsetLeft = selectedImageElement.offsetLeft;

        // 이미지가 컨테이너의 중앙에 위치하도록 스크롤 위치 계산
        const scrollPosition = imageOffsetLeft - containerWidth / 2 + imageWidth / 2;
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth"
        });
      }
    }
  };

  const handleGoToDetail = () => {
    if (mainEntry) {
      router.push(`/library/memory/${mainEntry.id}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDF7F4]">
      <CommonTitle title="내 그림 모아보기" />

      {loading ? (
        <span>로딩 중...</span>
      ) : mainEntry ? (
        <>
          <div className="relative artworkprev-content-height flex flex-grow items-center justify-center bg-white border border-[#D9D9D9]">
            {mainEntry.draw ? (
              <img src={mainEntry.draw} alt={`Artwork ${mainEntry.id}`} className="object-contain max-h-full" />
            ) : (
              <span>이미지 없음</span>
            )}

            <button
              onClick={handleGoToDetail}
              className="absolute right-3 bottom-4 bg-background02 border border-gray02 text-black px-4 py-2 rounded-full"
            >
              일기 상세 보기
            </button>
          </div>

          <div className="py-4 h-[135px]">
            <div
              ref={imageListRef} // 이미지 리스트에 ref 추가
              className="flex overflow-x-auto space-x-2 px-4"
              style={{ padding: "0px 50%" }}
            >
              {diaryEntries.map((entry) => (
                <div key={entry.id} className="flex-shrink-0 w-12 h-12">
                  <img
                    id={`image-${entry.id}`} // 각 이미지에 고유한 id 부여
                    src={entry.draw}
                    alt={`Artwork ${entry.id}`}
                    className={`w-full h-full object-cover cursor-pointer bg-white border border-[#D9D9D9] ${
                      entry.id === mainEntry.id ? "border-2 border-[#D84E35]" : ""
                    }`}
                    onClick={() => handleSwipeSelect(entry)}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <span>해당 다이어리 항목을 찾을 수 없습니다.</span>
      )}
    </div>
  );
};

export default GalleryPage;
