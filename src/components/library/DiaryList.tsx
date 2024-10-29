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
          <div
            key={`${diary.id}-${userId}`}
            className="border-b py-2 flex items-center"
            onClick={() => handleSelectDiary(diary)}
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedDiaryId === diary.id}
              onChange={() => handleSelectDiary(diary)}
            />
            <div>
              <h3 className="text-xl font-bold">{diary.title}</h3>
              <p>{diary.contents}</p>
              <span className="text-gray-500 text-sm">{diary.date}</span>
            </div>
          </div>
        ))
      ) : (
        <p>선택된 날짜에 대한 일기가 없습니다.</p>
      )}
    </div>
  );
};

export default DiaryList;
