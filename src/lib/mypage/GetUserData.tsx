import browserClient from "@/utils/supabase/client";

export const GetUserData = async (user_id: string) => {
  try {
    const { data, error } = await browserClient.from("users").select("*").eq("id", user_id);

    if (error) {
      console.error("유저정보 불러오기 실패 => ", error);
      return <div>유저정보를 불러오는데 실패하였습니다.</div>;
    }

    return data[0];
  } catch (error) {
    console.error("FetchData Error => ", error);
  }
};
