import React, { useEffect, useState } from "react";
import DiaryModal from "./DiaryModal";
import { Diary, DiaryReminderProps } from "@/types/library/Diary";
import browserClient from "@/utils/supabase/client";

const DiaryReminder: React.FC<DiaryReminderProps> = ({ userId, selectedYear }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<Diary>({
    id: "",
    user_id: "",
    title: "",
    contents: "",
    created_at: "",
    date: "",
    emotion: "",
    draw: ""
  });

  const fetchUserDiaries = async () => {
    try {
      const { data: userData, error: userError } = await browserClient
        .from("users")
        .select("main_diary")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      if (userData && userData.main_diary) {
        const { data: diaryData, error: diaryError } = await browserClient
          .from("diary")
          .select("*")
          .eq("id", userData.main_diary)
          .single();

        if (diaryError) throw diaryError;
        setSelectedDiary(diaryData);
      } else {
        setSelectedDiary({
          id: "",
          user_id: "",
          title: "",
          contents: "",
          created_at: "",
          date: "",
          emotion: "",
          draw: ""
        });
      }
    } catch (error) {
      console.error("Error fetching diaries:", error);
    }
  };

  useEffect(() => {
    fetchUserDiaries();
  }, [userId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteDiary = async () => {
    try {
      const { error } = await browserClient.from("diary").delete().eq("id", selectedDiary.id);
      if (error) throw error;

      // 사용자 데이터의 main_diary를 null로 업데이트
      const { error: userError } = await browserClient.from("users").update({ main_diary: null }).eq("id", userId);
      if (userError) throw userError;

      // 일기 삭제 후 상태 초기화
      setSelectedDiary({
        id: "",
        user_id: "",
        title: "",
        contents: "",
        created_at: "",
        date: "",
        emotion: "",
        draw: ""
      });
      setIsDeleteConfirmOpen(false); // 삭제 확인 모달 닫기

      fetchUserDiaries();
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="p-12 w-full max-w-sm rounded-lg text-center border bg-white">
        {/* id 존재 여부 */}
        {selectedDiary.id ? (
          <div>
            <h3>{selectedDiary.title}</h3>
            <p>{selectedDiary.contents}</p>
            <button className="px-4 py-2 rounded bg-gray-300 text-sm text-black hover:bg-gray-200">보러가기</button>
            <button onClick={() => setIsDeleteConfirmOpen(true)} className="mt-4 px-4 py-2 text-black">
              일기 삭제
            </button>
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
      </div>

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">정말로 이 일기를 삭제하시겠습니까?</h3>
            <div className="flex justify-between mt-4">
              <button onClick={handleDeleteDiary} className="px-4 py-2 text-black">
                삭제
              </button>
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 text-black">
                취소
              </button>
            </div>
          </div>
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
  );
};

export default DiaryReminder;
