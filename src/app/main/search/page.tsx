"use client";
import Header from "@/components/layout/Header";
import useGetDevice from "@/hooks/useGetDevice";
import getLoginUser from "@/lib/getLoginUser";
import { useInfiniteQuerySearchDiaries } from "@/lib/main/fetchDiaries";
import { getDayOfTheWeek, getSimpleFullDate } from "@/utils/calendar/dateFormat";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchDiaries, setSearchDiaries] = useState("");
  const [userId, setUserId] = useState<string>("");
  const device = useGetDevice();

  const { data: diaries, hasNextPage, fetchNextPage } = useInfiniteQuerySearchDiaries(searchDiaries, userId);
  const diariesList = diaries ? diaries.pages.flatMap((page) => page.searchPaginatedDiaries) : [];

  useEffect(() => {
    // userId를 가져오는 함수 실행
    const fetchUserId = async () => {
      const data = await getLoginUser();
      if (data) setUserId(data.id);
    };
    fetchUserId();
  }, []);

  //디바운스 적용
  useEffect(() => {
    const delayDebounceTimer = setTimeout(() => {
      setSearchDiaries(query);
    }, 500);
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
    <div>
      {device === "pc" && <Header />}
      <div className="mt-[44px] text-center py-[16px] lg:mt-[16px] lg:flex lg:flex-col lg:justify-between lg:items-center">
        <div className="flex lg:gap-[8px] justify-center items-center  w-[calc(100%-32px)] lg:w-full">
          <Link href={"/main"}>
            <img
              src="/icons/arrow-left-gray.svg"
              width={34}
              height={34}
              alt="arrow"
              className="ml-[16px] lg:mr-[25px]"
            />
          </Link>
          <input
            type="text"
            className="border-2 rounded-md h-[40px] bg-white w-[calc(100%-32px)] p-[10px] lg:h-[60px] lg:w-[944px] lg:rounded-2xl lg:border-[#A6A6A6] lg:text-[18px]"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {diariesList && diariesList.length > 0 ? (
          <div className="text-left py-[8px] px-[16px]">
            <p className="text-[16px] font-[400] mb-[8px] lg:text-[20px] ">검색결과 ({diariesList.length})</p>
            {diariesList.map((diary) => (
              <Link href={`/diary/read/${diary.id}`} key={diary.id}>
                {/* lg 미만일 때 보이는 부분 */}
                <div
                  key={diary.id}
                  className="p-[10px] border-[1px] border-black rounded-lg bg-white mb-[16px] lg:hidden"
                >
                  <p className="text-[16px] font-[400] overflow-hidden text-ellipsis mb-[2px]">{diary.title}</p>
                  <p className="text-[14px] font-[500] line-clamp-2 font-['Dovemayo'] mb-[8px] ">{diary.contents}</p>
                  <div className="flex justify-end text-[14px] font-[500] text-right">
                    <p className="mr-[2px]">{getSimpleFullDate(diary.date).substring(2)}</p>
                    <p>({getDayOfTheWeek(diary.date).substring(0, 1)})</p>
                  </div>
                </div>
                {/* lg 이상일 때 보이는 부분 */}
                <div className="hidden lg:block p-[10px] border-[1px] border-black rounded-lg bg-[#EFE6DE] mb-[16px] w-[992px] relative">
                  <div className="flex items-start">
                    {diary.draw ? (
                      <img
                        src={diary.draw}
                        alt="그림"
                        className="border-[2px] border-black rounded-lg object-cover h-[108px] w-[156px] mr-[16px] flex-shrink-0 bg-white"
                      />
                    ) : (
                      <div className="flex items-center justify-center border-[2px] border-black rounded-lg h-[108px] w-[156px] mr-[16px] flex-shrink-0 bg-white">
                        그림이 없습니다.
                      </div>
                    )}
                    <div>
                      <p className="font-[400] overflow-hidden text-ellipsis mb-[2px] text-[18px]">{diary.title}</p>
                      <p className="font-[500] line-clamp-2 font-['Dovemayo'] mb-[8px] text-[16px]">{diary.contents}</p>
                      <div className="flex justify-end text-[14px] font-[500] text-right text-[#A6A6A6] absolute bottom-[10px] right-[10px]">
                        <p className="mr-[2px] font-['Dovemayo'] text-[#0D0D0D] text-[16px] font-[500]">
                          {getSimpleFullDate(diary.date).substring(2)}
                        </p>
                        <p className="font-['Dovemayo'] text-[#0D0D0D] text-[16px] font-[500]">
                          ({getDayOfTheWeek(diary.date).substring(0, 1)})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[10px] mt-[300px]">
            <p className="text-[18px] font-[400] lg:text-[20px]">일치하는 검색결과가 없습니다.</p>
            <p className="text-[16px] font-[400] text-gray-400 lg:text-[18px]">오늘은 어떤 이야기를 들려주실 건가요?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
