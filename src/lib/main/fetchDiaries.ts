"use client";
import { SortedDiaries } from "@/types/main/Calendar";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import browserClient from "@/utils/supabase/client";

//SECTION - 일기 데이터 fetch
export const getInitialDiaries = async () => {
  const { data: initialDiaries } = await browserClient.from("diary").select().order("date", { ascending: false });
  return initialDiaries;
};
export const useFetchDiaries = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["allDiaries"],
    queryFn: async () => {
      return await getInitialDiaries();
    }
  });
  return { data, error, isLoading };
};

//SECTION - 조회범위 일기 데이터 가져오기 & 셀 클릭 시 일기 데이터 가져오기
export const getSelectedDiaries = async (startDate: string, endDate: string) => {
  const { data: selectedDiaries } = await browserClient
    .from("diary")
    .select()
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  return selectedDiaries as SortedDiaries[];
};

//SECTION - search 페이지 =======================================================================
export const getSearchPaginatedDiaries = async (pageParam: number, limit: number, value: string) => {
  const from = (pageParam - 1) * limit;
  const to = pageParam * limit - 1;

  const {
    data: searchPaginatedDiaries,
    error,
    count
  } = await browserClient
    .from("diary")
    .select("*", { count: "exact" })
    .like("contents", `%${value}%`)
    .order("date", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const hasNext = to + 1 < (count || 0);
  return { searchPaginatedDiaries, hasNext, nextPage: pageParam + 1, count };
};

export const useInfiniteQuerySearchDiaries = (searchKeyword: string) => {
  const { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["searchDiaries", searchKeyword],
    enabled: !!searchKeyword, // searchKeyword가 있을 때만 쿼리 실행
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getSearchPaginatedDiaries(pageParam, 10, searchKeyword),
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNext ? lastPage.nextPage : undefined;
    }
  });

  return { data, isError, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage };
};

//SECTION - DiaryList.tsx =======================================================================
export const getPaginatedDiaries = async (pageParam: number, limit: number) => {
  const from = (pageParam - 1) * limit;
  const to = pageParam * limit - 1;

  const {
    data: diariesList,
    error,
    count
  } = await browserClient

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
