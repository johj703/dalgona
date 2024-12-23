import React, { useState } from "react";
import { DiaryListProps, Diary } from "@/types/library/Diary";

const DiaryList: React.FC<DiaryListProps> = ({ diaries, loading, userId, onSelectDiary }) => {
  const [selectedDiaryId, setSelectedDiaryId] = useState<string | null>(null);

  const handleSelectDiary = (diary: Diary) => {
    setSelectedDiaryId(diary.id);
    onSelectDiary(diary);
  };

  return (
    <div className="h-full overflow-y-auto">
      {loading ? (
        <p>Loading...</p>
      ) : diaries.length > 0 ? (
        diaries.map((diary) => (
          <div key={`${diary.id}-${userId}`} className="flex items-center mt-4 cursor-pointer">
            {/* 기본 버튼을 숨기고 커스텀 버튼 표시 */}
            <input
              type="radio"
              id={`radio-${diary.id}`}
              checked={selectedDiaryId === diary.id}
              onChange={() => handleSelectDiary(diary)}
              className="hidden"
            />

            {/* 커스텀 라디오 버튼 */}
            <label htmlFor={`radio-${diary.id}`} className="flex items-center justify-center mr-[10px] cursor-pointer">
              <span
                className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${
                  selectedDiaryId === diary.id ? "border-utility01" : "border-gray04"
                }`}
              />
            </label>

            <div className="border border-black bg-background rounded-lg p-2 flex-1">
              <h3 className="text-sm font-medium">{diary.title}</h3>
              <p className="line-clamp-1 text-xs text-black font-Dovemayo lg:font-thin">{diary.contents}</p>
              <div className="flex justify-end">
                <span className="text-black font-Dovemayo text-xs mt-1 lg:font-thin">{ChangeDateForm(diary.date)}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-center text-gray04 font-Dovemayo_gothic text-base">선택된 날짜에 일기가 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default DiaryList;

import { calDate } from "../../utils/diary/calDate";

export const ChangeDateForm = (date: string) => {
  const Month = date.split("월")[0].slice(-2);
  const Day = date.split("일")[0].slice(-2);
  const GetDate = calDate(new Date(`${date.split("년")[0]}-${Month}-${Day}`).getDay());

  return (
    <>
      <div>
        {Month}.{Day}
        <span>({GetDate})</span>
      </div>
    </>
  );
};
