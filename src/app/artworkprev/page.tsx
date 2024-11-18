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

  // 로그인한 사용자의 ID 가져오기
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

  // 메인그림(mainEntry)이 변경될 때마다 스크롤 위치 조정
  // useEffect(() => {
  //   if (mainEntry && imageListRef.current) {
  //     const container = imageListRef.current;
  //     const selectedImageElement = document.getElementById(`image-${mainEntry.id}`);

  //     if (selectedImageElement) {
  //       const containerWidth = container.offsetWidth;
  //       const imageWidth = selectedImageElement.offsetWidth;
  //       const imageOffsetLeft = selectedImageElement.offsetLeft;

  //       const scrollPosition = imageOffsetLeft - containerWidth / 2 + imageWidth / 2;
  //       container.scrollTo({
  //         left: scrollPosition,
  //         behavior: "smooth"
  //       });
  //     }
  //   }
  // }, [mainEntry]);

  useEffect(() => {
    if (mainEntry && imageListRef.current) {
      const container = imageListRef.current;
      const selectedImageElement = document.getElementById(`image-${mainEntry.id}`);

      if (selectedImageElement) {
        const imageWidth = selectedImageElement.offsetWidth;
        const imageIndex = Number(selectedImageElement.dataset.idx);

        const scrollPosition = (imageWidth + 8) * imageIndex + imageWidth / 2;
        console.log("야", scrollPosition);
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth"
        });
      }
    }
  }, [mainEntry]);

  const handleSwipeSelect = (entry: Diary) => {
    setMainEntry(entry);
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
          <div className="relative artworkprev-content-height flex flex-grow items-center justify-center bg-white border border-[#D9D9D9] lg:max-w-4lg lg:mx-auto lg:bg-background02">
            {mainEntry.draw ? (
              <img
                src={mainEntry.draw}
                alt={`Artwork ${mainEntry.id}`}
                className="object-contain max-h-full lg:bg-white"
              />
            ) : (
              <span>이미지 없음</span>
            )}
            <div>
              <button
                onClick={handleGoToDetail}
                className="absolute right-3 bottom-4 bg-background02 border border-gray02 text-black px-4 py-2 rounded-full font-Dovemayo_gothic lg:rounded-2xl lg:right-4 lg:bottom-6 lg:text-sm"
              >
                일기 상세 보기
              </button>
            </div>
          </div>

          <div className="py-4 h-[115px] lg:h-auto lg:border lg:border-gray03 lg:bg-background01">
            <div ref={imageListRef} className="flex overflow-x-auto space-x-2 px-4 " style={{ padding: "0px 50%" }}>
              {diaryEntries.map((entry, idx) => (
                <div key={entry.id} className="flex-shrink-0 w-12 h-12 lg:w-[68px] lg:h-[68px]">
                  <img
                    id={`image-${entry.id}`}
                    src={entry.draw}
                    alt={`Artwork ${entry.id}`}
                    data-idx={idx}
                    className={`w-full h-full object-cover cursor-pointer bg-white border border-gray02 lg:rounded lg:border-gray04  ${
                      entry.id === mainEntry?.id ? "border-2 border-[#D84E35]" : ""
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
