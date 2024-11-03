import browserClient from "@/utils/supabase/client";

export const delDrafts = async (delList: string[]) => {
  const response = await browserClient.from("drafts").delete().in("id", delList);

  return response;
};
