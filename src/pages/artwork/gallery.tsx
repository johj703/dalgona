import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import browserClient from "@/utils/supabase/client";
import { Diary } from "@/types/library/Diary";
import { useRouter } from "next/router";

const GalleryPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const diaryId = searchParams ? searchParams.get("id") : null; // URL에서 ID 가져오기
  const [diaryEntry, setDiaryEntry] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiaryEntry = async () => {
      if (diaryId) {
        const { data, error } = await browserClient
          .from("diary")
          .select("*")
          .eq("id", diaryId) // ID에 해당하는 다이어리 항목 가져오기
          .single();

        if (error) {
          console.error("다이어리 항목 가져오기 실패 =>", error);
        } else {
          setDiaryEntry(data);
        }
        setLoading(false);
      }
    };

    fetchDiaryEntry();
  }, [diaryId]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex p-4">
        <button onClick={() => router.back()} className="text-black">
          ◀
        </button>
        <p className="text-xl font-bold flex-grow text-center">내 그림 모아보기</p>
      </div>

      {loading ? (
        <span>로딩 중...</span>
      ) : diaryEntry ? (
        <div>
          {/* <h1>{diaryEntry.title}</h1> */}
          {diaryEntry.draw ? <img src={diaryEntry.draw} alt={`Artwork ${diaryEntry.id}`} /> : <span>이미지 없음</span>}
        </div>
      ) : (
        <span>해당 다이어리 항목을 찾을 수 없습니다.</span>
      )}
    </div>
  );
};

export default GalleryPage;
