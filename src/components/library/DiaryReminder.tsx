import React, { useEffect, useState } from "react";
import DiaryModal from "./DiaryModal";
import { Diary, DiaryReminderProps } from "@/types/library/Diary";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const DiaryReminder: React.FC<DiaryReminderProps> = ({ userId, selectedYear }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  console.log("sd=>", selectedDiary);

  useEffect(() => {
    const fetchUserDiaries = async () => {
      try {
        // users에서 main_diary 불러오기
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("main_diary")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        // main_diary로 일기 데이터 불러오기
        if (userData && userData.main_diary) {
          const { data: diaryData, error: diaryError } = await supabase
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
          }); // mian_diary 없으면 초기화
        }
      } catch (error) {
        console.error("Error fetching diaries:", error);
      }
    };

    fetchUserDiaries();
  }, [userId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="p-12 w-full max-w-sm rounded-lg text-center border bg-white">
        {/* id 존재 여부 */}
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
