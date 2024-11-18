import browserClient from "@/utils/supabase/client";

export const getMyDrawing = async ({ userId, device }: { userId: string; device: string }) => {
  const maxRange = device === "pc" ? 5 : 2;

  const { data, count } = await browserClient
    .from("diary")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .neq("draw", null)
    .order("created_at", { ascending: false })
    .range(0, maxRange);
  return { data, count };
};
