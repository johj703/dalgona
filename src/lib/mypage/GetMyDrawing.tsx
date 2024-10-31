import browserClient from "@/utils/supabase/client";

export const GetMyDrawing = async (user_id: string) => {
  try {
    const { data } = await browserClient
      .from("diary")
      .select("*")
      .eq("user_id", user_id)
      .neq("draw", null)
      .order("created_at", { ascending: false })
      .range(0, 2);

    return data;
  } catch (error) {
    console.error("Drawing Load Error => ", error);
  }
};
