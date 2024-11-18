import browserClient from "../../utils/supabase/client";

export const getDraftsById = async (user_id: string) => {
  const { data, error } = await browserClient
    .from("drafts")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("임시저장 목록 불러오기 실패 => ", error);
    throw new Error("임시저장 데이터를 가져오는 중 오류가 발생했습니다." + error.message);
  }
  return data;
};

export const deleteDraftsById = async (delList: string[]) => {
  const { data, error } = await browserClient.from("drafts").delete().in("id", delList);
  if (error) {
    console.error("임시저장 일기 삭제 실패 =>", error);
    throw new Error("임시저장 일기 삭제하는 중 오류가 발생했습니다." + error.message);
  }
  return data;
};

export const getDraftById = async (params: string) => {
  const { data, error } = await browserClient.from("drafts").select("*").eq("id", params);

  if (error) {
    console.error("일기 불러오기 실패 => ", error);
    throw new Error("일기를 불러오는 중 오류가 발생했습니다." + error.message);
  }

  return data[0];
};
