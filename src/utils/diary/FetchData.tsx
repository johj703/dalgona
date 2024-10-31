import { toast } from "garlic-toast";
import browserClient from "../supabase/client";

export const FetchData = async (params: string) => {
  try {
    const { data, error } = await browserClient.from("diary").select("*").eq("id", params);

    if (error) {
      toast.error("일기를 불러오는데 실패했습니다.");
      console.error("일기 불러오기 실패 => ", error);
      return <div>일기를 불러오는데 실패하였습니다.</div>;
    }

    return data[0];
  } catch (error) {
    console.error("FetchData Error => ", error);
  }
};
