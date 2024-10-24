import React, { useState } from "react";
import DiaryModal from "./DiaryModal";
import { DiaryReminderProps } from "@/types/Diary";

const DiaryReminder: React.FC<DiaryReminderProps> = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="p-12 w-full max-w-sm rounded-lg text-center border bg-white">
        <h2 className="text-lg mb-3 font-normal">기억하고 싶은 순간이 있으신가요?</h2>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 rounded bg-gray-300 text-sm text-black hover:bg-gray-200"
        >
          등록하기
        </button>
        {isModalOpen && <DiaryModal onClose={handleCloseModal} userId={userId} />}
      </div>
    </div>
  );
};

export default DiaryReminder;
