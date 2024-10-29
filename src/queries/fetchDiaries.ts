"use client";
import { SortedDiaries } from "@/types/main/Calendar";
import { useQuery } from "@tanstack/react-query";
import browserClient from "@/utils/supabase/client";
// import { createClient } from "@/utils/supabase/server";

//NOTE - 처음 일기 데이터 받아오기
export const getInitialDiaries = async () => {
  const { data: initialDiaries } = await browserClient.from("diary").select().order("date", { ascending: false });
  return initialDiaries;
};

//NOTE - useQuery로 fetch하기
export const useFetchDiaries = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["diaries"],
    queryFn: async () => {
      return await getInitialDiaries();
    }
  });
  return { data, error, isLoading };
};

//NOTE - 조회한 날짜 일기 데이터 가져오기
export const getSelectedDiaries = async (startDate: string, endDate: string) => {
  const { data: selectedDiaries } = await browserClient
    .from("diary")
    .select()
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  return selectedDiaries as SortedDiaries[];
};

//NOTE -
export const getSearchDiaries = async (value: string) => {
  if (value) {
    const { data: searchDiaries } = await browserClient.from("diary").select().like("contents", `%${value}%`);
    return searchDiaries as SortedDiaries[];
  }
};

//
// export const getDrawings = async () => {
//   const { data } = browserClient.storage.from("posts").getPublicUrl("default.png", {
//     transform: {
//       width: 100,
//       height: 100
//     }
//   });
//   console.log(data);
// };

// getDrawings();
