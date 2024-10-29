import React from "react";

import { DiaryListProps } from "@/types/library/Diary";

const DiaryList: React.FC<DiaryListProps> = ({ diaries, loading, userId }) => (
  <div className="h-full overflow-y-auto">
    {loading ? (
      <p>Loading...</p>
    ) : diaries.length > 0 ? (
      diaries.map((diary) => (
        <div key={`${diary.id}-${userId}`} className="border-b py-2 flex items-center">
          <input type="checkbox" className="mr-2" />
          <div>
            <h3 className="text-xl font-bold">{diary.title}</h3>
            <p>{diary.contents}</p>
            <span className="text-gray-500 text-sm">{diary.date}</span>
          </div>
        </div>
      ))
    ) : (
      <p>No diaries found for selected date.</p>
    )}
  </div>
);

export default DiaryList;
