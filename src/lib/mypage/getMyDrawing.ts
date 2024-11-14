import browserClient from "@/utils/supabase/client";

export const getMyDrawing = async (user_id: string, device: string) => {
  const maxRange = device === "pc" ? 5 : 2;
  try {
    const { data, count } = await browserClient
      .from("diary")
      .select("*", { count: "exact" })
      .eq("user_id", user_id)
      .neq("draw", null)
      .order("created_at", { ascending: false })
      .range(0, maxRange);

    return { data, count };
  } catch (error) {
    console.error("Drawing Load Error => ", error);
  }
};
