import browserClient from "@/utils/supabase/client";

export const loadDraft = async (params: string) => {
  try {
    const { data, error } = await browserClient.from("drafts").select("*").eq("id", params);

    if (error) {
      console.error("일기 불러오기 실패 => ", error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error("FetchData Error => ", error);
  }
};
