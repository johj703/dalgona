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

//NOTE - 페이지 단위로 데이터 가져오기
export const getPaginatedDiaries = async (pageParam: number, limit: number) => {
  const from = (pageParam - 1) * limit;
  const to = pageParam * limit - 1;

  const { data: diariesList, error } = await browserClient
    .from("diary")
    .select("*")
    // .eq('user_id', user_id)
    .range(from, pageParam * to);

  if (error) {
    throw new Error(error.message);
  }
  return diariesList; //데이터반환
};

//NOTE - useInfiniteQuery 사용하기
// export const useInfiniteQueryDiaries = () => {
//   const {
//     data,
//     isError,
//     isLoading,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage
//   } = useInfiniteQuery({
//     queryKey: ['diary'],
//     queryFn: ({ pageParam = 1 }) => getPaginatedDiaries(pageParam, 10),
//     getNextPageParam: (lastPage, pages) => {
//       if (lastPage.length < 6) return undefined;
//       return pages.length + 1;
//     },
//     staleTime: 300000
//   });

//   return { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
// };

// type Param = {
//   pageParam:number
// }
// export const useInfiniteQueryDiaries = () => {
//   const {
//     isFetching,
//     fetchNextPage,
//     data,
//     refetch
//   } = useInfiniteQuery(
//     queryKey:['diary'],
//     queryFn: ({ pageParam = 1 }) => getPaginatedDiaries(pageParam,10),
//     {
//       getNextPageParam: (lastPage, allPages) => lastPage.nextCursor
//     }
//   )
//   return { data,
//     isFetching,
//     fetchNextPage,
//     data,
//     refetch};
// };
