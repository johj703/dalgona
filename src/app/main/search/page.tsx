"use client";
import { useInfiniteQuerySearchDiaries } from "@/lib/main/fetchDiaries";
import { getDayOfTheWeek, getSimpleDate } from "@/utils/calendar/dateFormat";
import Link from "next/link";
import React, { useEffect, useState } from "react";

//TODO - 일기 클릭하면 상세로 이동
//TODO - 최근검색어..?

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchDiaries, setSearchDiaries] = useState("");

  const { data: diaries, hasNextPage, fetchNextPage } = useInfiniteQuerySearchDiaries(searchDiaries);
  const diariesList = diaries ? diaries.pages.flatMap((page) => page.searchPaginatedDiaries) : [];

  //디바운스 적용
  useEffect(() => {
    const delayDebounceTimer = setTimeout(() => {
      setSearchDiaries(query);
    }, 1000);
    return () => clearTimeout(delayDebounceTimer);
  }, [query]);

  useEffect(() => {
    let fetching = false;
    const handleScroll = async () => {
      const { scrollHeight, scrollTop, clientHeight } = document.scrollingElement as HTMLElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true;
        if (hasNextPage) await fetchNextPage();
        fetching = false;
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="p-6 mt-4 text-center">
      <div className="flex gap-4 p-2">
        <Link href={"/main"}>
          <div className="pt-2">◀︎</div>
        </Link>
        <input
          type="text"
          className="border-2 rounded-md w-[300px] h-[40px] bg-zinc-200 p-2"
          placeholder="일기를 검색해주세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {diariesList && diariesList.length > 0 ? (
        <div className="text-left">
          <p className="text-sm p-2">검색결과 ({diariesList.length})</p>
          {diariesList.map((diary) => (
            <div key={diary.id} className="border-2 p-2 rounded-md my-2">
              <p>{diary.contents}</p>
              <div className="flex text-sm">
                <p className="mr-2">{getDayOfTheWeek(diary.date)}</p>
                <p>{getSimpleDate(diary.date)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="font-bold m-6">일치하는 검색결과가 없습니다.</p>
          <p className="text-sm text-gray-400">오늘은 어떤 이야기를 들려주실 건가요?</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
