import React, { useState } from "react";
import DiaryModal from "./DiaryModal";
import { Diary, DiaryReminderProps } from "@/types/library/Diary";

const DiaryReminder: React.FC<DiaryReminderProps> = ({ userId, selectedYear }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<Diary>({
    id: "",
    user_id: "",
    title: "",
    contents: "",
    created_at: "",
    date: ""
  });
  console.log("sd=>", selectedDiary);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="p-12 w-full max-w-sm rounded-lg text-center border bg-white">
        {selectedDiary.id ? (
          <div>
            <h3>{selectedDiary.title}</h3>
            <p>{selectedDiary.contents}</p>
            <button>보러가기</button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg mb-3 font-normal">기억하고 싶은 순간이 있으신가요?</h2>
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 rounded bg-gray-300 text-sm text-black hover:bg-gray-200"
            >
              등록하기
            </button>
          </div>
        )}
        {isModalOpen && (
          <DiaryModal
            onClose={handleCloseModal}
            userId={userId}
            selectedYear={selectedYear}
            setSelectedDiary={setSelectedDiary}
          />
        )}
      </div>
    </div>
  );
};

export default DiaryReminder;
