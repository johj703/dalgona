import browserClient from "@/utils/supabase/client";

export const delDrafts = async (delList: string[]) => {
  const response = await browserClient.from("drafts").delete().in("id", delList);

  const deleteStorage = delList.map((item) => "drawing/" + item);
  const { error } = await browserClient.storage.from("posts").remove([...deleteStorage]);
  if (error) console.error(error);

  return response;
};
