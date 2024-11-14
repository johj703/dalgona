import React, { useEffect, useState } from "react";
import DiaryModal from "./DiaryModal";
import { Diary, DiaryReminderProps } from "@/types/library/Diary";
import Modal from "@/components/Modal";
import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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
      const { error: userError } = await browserClient.from("users").update({ main_diary: null }).eq("id", userId);
      if (userError) throw userError;

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
      setIsDeleteConfirmOpen(false);

      fetchUserDiaries();
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
  };

  const handleGoToDetail = () => {
    if (selectedDiary.id) {
      router.push(`/library/memory/${selectedDiary.id}`);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-4">
      <div className="w-full max-w-sm rounded-lg bg-background lg:max-w-[488px]">
        {selectedDiary.id ? (
          <div className="h-[210px] px-4 py-4 rounded-lg border border-gray04 justify-center flex items-center gap-3 relative lg:border-2 lg:border-black">
            <div className="w-[100px] h-[120px] flex-shrink-0">
              <img src={`/images/special-diary.svg`} alt={``} className="object-cover w-full h-full" />
            </div>
            <div>
              <h3 className="text-black text-lg font-medium leading-normal pb-1">{selectedDiary.title}</h3>
              <p className="w-[202px] h-11 text-black text-sm font-normal leading-[21px] line-clamp-2">
                {selectedDiary.contents}
              </p>
              <div className="pt-2">
                <button
                  onClick={handleGoToDetail}
                  className="w-[131px] h-10 px-3 bg-[#d84e35] rounded-lg flex justify-center items-center text-background text-sm font-semibold leading-[21px]"
                >
                  보러가기
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="text-[#a5a5a5] text-sm font-medium leading-[21px] absolute bottom-0 right-0 mb-4 mr-4"
            >
              일기 삭제
            </button>
          </div>
        ) : (
          <div className="h-[210px] px-4 pt-16 pb-[52px] rounded-lg border border-gray03 justify-center flex flex-col items-center lg:border-2 lg:border-black">
            <h2 className="text-lg font-medium leading-normal pb-6">기억하고 싶은 순간이 있으신가요?</h2>
            <button
              onClick={handleOpenModal}
              className="bg-[#d84e35] rounded-lg justify-center w-[170px] h-[46px] px-3 py-1 text-background text-sm leading-[21px]"
            >
              등록하기
            </button>
          </div>
        )}
      </div>

      {isDeleteConfirmOpen && (
        <Modal
          mainText="등록한 일기를 삭제하시겠습니까?"
          subText="등록한 일기에서만 삭제되며 원본은 유지돼요!"
          isConfirm={true}
          setModalState={setIsDeleteConfirmOpen}
          confirmAction={handleDeleteDiary}
        />
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
