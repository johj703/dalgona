import browserClient from "@/utils/supabase/client";

export const fetchDrafts = async (user_id: string) => {
  const { data } = await browserClient
    .from("drafts")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  return data;
};
