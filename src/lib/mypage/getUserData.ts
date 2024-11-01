import browserClient from "@/utils/supabase/client";

export const getUserData = async (user_id: string) => {
  try {
    const { data, error } = await browserClient.from("users").select("*").eq("id", user_id);

    if (error) {
      return console.error("유저정보 불러오기 실패 => ", error);
    }

    return data[0];
  } catch (error) {
    console.error("FetchData Error => ", error);
  }
};
