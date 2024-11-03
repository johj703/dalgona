"use client";
import { SortedDiaries } from "@/types/main/Calendar";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// import { useInfiniteQuery} from "@tanstack/react-query";
import browserClient from "@/utils/supabase/client";

//NOTE - 처음 일기 데이터 받아오기
export const getInitialDiaries = async () => {
  const { data: initialDiaries } = await browserClient.from("diary").select().order("date", { ascending: false });
  return initialDiaries;
};

//NOTE - useQuery로 fetch하기
export const useFetchDiaries = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["allDiaries"],
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
  console.log("pageParam", pageParam);

  const from = (pageParam - 1) * limit; //10
  const to = pageParam * limit - 1; //19

  const {
    data: diariesList,
    error,
    count
  } = await browserClient //REVIEW - count추가

    .from("diary")
    .select("*", { count: "exact" }) //REVIEW -  전체 개수(count)를 포함하여 가져오기 ***
    // .eq('user_id', user_id)
    .order("date", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }
  //REVIEW -  다음 페이지가 있는지 확인
  const hasNext = to + 1 < (count || 0);
  return { diariesList, hasNext, nextPage: pageParam + 1, count }; // hasNext와 nextPage 반환
};

// NOTE - useInfiniteQuery 사용하기
export const useInfiniteQueryDiaries = () => {
  const { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["diaries"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getPaginatedDiaries(pageParam, 5),
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNext ? lastPage.nextPage : undefined;
    }
  });

  return { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};
