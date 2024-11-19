import React, { useEffect, useState } from "react";
import { Diary, DiaryContentProps } from "@/types/library/Diary";
import { getEmoji } from "@/utils/diary/getEmoji";
import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getDayOfTheWeek } from "@/utils/calendar/dateFormat";

const parseDate = (dateStr: string): Date | null => {
  const regex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일/;
  const match = dateStr.match(regex);

  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return null;
};

const DiaryContent: React.FC<DiaryContentProps> = ({ userId, year, month }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const { data, error } = await browserClient.from("diary").select("*").eq("user_id", userId);
        if (error) throw error;

        const filteredDiaries = data
          ?.filter((diary: Diary) => {
            const diaryDate = parseDate(diary.date);
            return diaryDate?.getFullYear() === year && diaryDate?.getMonth() + 1 === month;
          })
          .sort((a: Diary, b: Diary) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
          });

        setDiaries(filteredDiaries || []);
      } catch (error) {
        console.error("Error fetching diaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, [userId, year, month]);

  if (loading) return <p className="text-center">로딩 중...</p>;

  const handleGoToWritePage = () => {
    router.push("/diary/write");
  };

  const handleDiaryClick = (id: string) => {
    router.push(`/library/memory/${id}`);
  };

  return (
    <div className="flex flex-col p-4 bg-[#FDF7F4]">
      {diaries.length > 0 && (
        <div className="border border-black rounded-lg p-4 mb-4 bg-white lg:w-3/4 lg:mx-auto">
          <p className="text-center font-bold">나만의 {month}월이 완성되어 가고 있어요!</p>
          <p className="text-center font-bold">많은 날들이 일기로 남았어요.</p>
        </div>
      )}
      {diaries.length > 0 ? (
        <div className="space-y-4 border-2 rounded-2xl p-4 mb-12 bg-[#EFE6DE] border-black lg:px-[85px]">
          {diaries.map((diary: Diary) => {
            const diaryDate = parseDate(diary.date);
            const formattedDate = diaryDate
              ? `${diaryDate.getDate()} ${getDayOfTheWeek(diary.date)}`
              : "날짜 정보 없음";

            return (
              <div
                key={diary.id}
                className="border relative rounded-2xl bg-[#FDF7F4] border-black px-4 cursor-pointer lg:border-2"
                onClick={() => handleDiaryClick(diary.id)}
              >
                {diary.draw ? (
                  <div>
                    <h3 className="text-base font-Dovemayo_gothic font-semibold lg:text-2xl mt-[19px]">
                      {diary.title}
                    </h3>
                    <div className="relative mt-4 mb-2">
                      <div className="relative h-[238px] border border-black flex items-center justify-center rounded-lg overflow-hidden bg-white lg:h-96 lg:border-2">
                        <img src={diary.draw} alt="그림" className="object-cover h-full w-full" />
                      </div>

                      <span className="absolute top-2 left-2 text-xs py-2 px-2 bg-white border border-black rounded-md text-black lg:border-2">
                        {formattedDate}
                      </span>

                      {diary.emotion && (
                        <div className="absolute top-2 right-2 flex items-center">
                          <img src={getEmoji(diary.emotion, "on")} alt={diary.emotion} className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    <p className="text-black line-clamp-2 mt-2 mb-5 font-Dovemayo lg:line-clamp-4">{diary.contents}</p>
                  </div>
                ) : (
                  <div className="relative">
                    <h3 className="text-base font-Dovemayo_gothic mt-2 py-1 font-semibold lg:text-2xl mb-2">
                      {diary.title}
                    </h3>

                    <span className="text-xs pl-2 px-[6px] py-2 bg-white border border-black rounded-md text-black lg:mt-4 lg:border-2">
                      {formattedDate}
                    </span>

                    <p className="text-black line-clamp-2 mt-4 mb-[13px] font-Dovemayo lg:line-clamp-4">
                      {diary.contents}
                    </p>

                    {diary.emotion && (
                      <div className="absolute top-1 right-0">
                        <img src={getEmoji(diary.emotion, "on")} alt={diary.emotion} className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-[656px] flex-col items-center justify-center bg-background01 border-2 rounded-lg border-black p-4 lg:max-h-lg">
          <div className="flex items-center mb-2">
            <p className="text-lg font-bold text-center mr-2">이번 달에 작성된 일기가 없어요</p>
            <img src="/icons/mini-diary.svg" alt="mini-diary" className="w-6 h-6" />
          </div>
          <p className="text-center text-[#a5a5a5]">하루의 소중한 기록을 남겨보세요.</p>
          <button
            onClick={handleGoToWritePage}
            className="mt-4 px-4 py-2 bg-white border border-black rounded-lg text-black flex items-center"
          >
            일기 쓰러 가기
            <img src="/icons/mini-pencil.svg" alt="mini-pencil" className="ml-2 w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DiaryContent;
