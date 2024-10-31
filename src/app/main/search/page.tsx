"use client";
import { getSearchDiaries } from "@/queries/fetchDiaries";
import { SortedDiaries } from "@/types/main/Calendar";
import Link from "next/link";
import React, { useEffect, useState } from "react";

//TODO - 일기 클릭하면 상세로 이동
//TODO - 무한스크롤
//TODO - 최근검색어..?

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchDiaries, setSearchDiaries] = useState<SortedDiaries[]>([]);

  // 입력 값이 변경될 때마다 타이머 설정
  useEffect(() => {
    const delayDebounceTimer = setTimeout(async () => {
      //api코드
      const searchDiaries = await getSearchDiaries(query);
      //받아온 값을 setSearchResults에 저장
      setSearchDiaries(searchDiaries as SortedDiaries[]);
    }, 1000); //디바운스 지연 시간
    // 이전에 설정한 타이머를 클리어하여 디바운스 취소
    return () => clearTimeout(delayDebounceTimer);
  }, [query]);
  return (
    <div className="p-6 mt-4 text-center">
      <div className="flex gap-4 p-2">
        <Link href={"/main"}>
          <div className="pt-2">◀︎</div>
        </Link>
        <input
          type="text"
          className="border-2 rounded-md w-[300px] h-[40px] bg-zinc-200 p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {searchDiaries ? (
        <div className="text-left">
          <p className="text-sm p-2">검색결과 ({searchDiaries.length})</p>
          {searchDiaries.map((diary) => (
            <div key={diary.id} className="border-2 p-2 rounded-md my-2">
              <p>{diary.contents}</p>
              <p className="text-right text-sm">{diary.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="font-bold m-6">검색된 내용이 없네요.</p>
          <p className="text-sm text-gray-400">오늘은 어떤 이야기를 들려주실 건가요?</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
