import browserClient from "@/utils/supabase/client";

export const getMonthlyEmotion = async (user_id: string) => {
  const Today = new Date();
  const Year = Today.getFullYear();
  const Month = Today.getMonth() < 9 ? `0${Today.getMonth() + 1}` : Today.getMonth() + 1;

  try {
    const result = await browserClient
      .from("diary")
      .select("emotion")
      .eq("user_id", user_id)
      .textSearch("date", `${Year}년&${Month}월`);

    if (result.data) {
      const monthlyData = result.data;
      const emotionData = [
        monthlyData?.filter((emotion) => emotion.emotion === "행복해요").length, //기쁨 텍스트 수정 필요
        monthlyData?.filter((emotion) => emotion.emotion === "편안해요").length,
        monthlyData?.filter((emotion) => emotion.emotion === "설레요").length,
        monthlyData?.filter((emotion) => emotion.emotion === "뿌듯해요").length,
        monthlyData?.filter((emotion) => emotion.emotion === "힘들어요").length,
        monthlyData?.filter((emotion) => emotion.emotion === "우울해요").length,
        monthlyData?.filter((emotion) => emotion.emotion === "슬퍼요").length,
        monthlyData?.filter((emotion) => emotion.emotion === "화나요").length
      ];

      return emotionData;
    }
  } catch (error) {
    console.error("Emotion Load Error => ", error);
  }
};
