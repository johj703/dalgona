import browserClient from "../supabase/client";

export const getDiaryById = async (diaryId: string) => {
  const { data, error } = await browserClient.from("diary").select("*").eq("id", diaryId);

  if (error) {
    console.error("일기 불러오기 실패 => ", error);
    throw new Error("일기 데이터를 가져오는 중 오류가 발생했습니다." + error.message);
  }
  return data;
};

export const deleteDiaryById = async (diaryId: string) => {
  const { data, error } = await browserClient.from("diary").delete().eq("id", diaryId);
  if (error) {
    console.error("일기 삭제 실패 =>", error);
    throw new Error("일기 삭제하는 중 오류가 발생했습니다." + error.message);
  }
  return data;
};
