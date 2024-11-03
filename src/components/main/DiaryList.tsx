"use client";
import { useInfiniteQueryDiaries } from "@/queries/fetchDiaries";
import { Select, Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import TopButton from "./TopButton";
import { formatDate, getDayOfTheWeek } from "@/utils/calendar/dateFormat";
import { SortedDiaries } from "@/types/main/Calendar";
import Link from "next/link";

//TODO - 감정이미지 가져오기
//TODO - next.js 이미지 최적화

const DiaryList = () => {
  const [originDiaries, setOriginDiaries] = useState<SortedDiaries[]>([]);
  const [sortedDiaries, setSortedDiaries] = useState<SortedDiaries[]>([]);
  const [selectedBox, setSelectedBox] = useState<string>("최신순");

  //prefetchQuery를 통해 캐시에 미리 저장된 데이터가 있으니, 새롭게 데이터를 가져오지 않고 캐시에 저장된 데이터를 반환
  // const { data: diaries } = useFetchDiaries();
  const { data: diaries, hasNextPage, fetchNextPage } = useInfiniteQueryDiaries();

  //REVIEW -  모든 페이지의 diariesList 데이터를 합쳐서 가져오기
  const originList = diaries?.pages.flatMap((page) => page.diariesList) || [];

  useEffect(() => {
    if (diaries) {
      setOriginDiaries(originList);
      setSortedDiaries(originList); // 초기 화면에서도 정렬된 데이터가 필요하므로, 기본적으로 최신순으로 정렬
    }
  }, [diaries]);

  // 정렬시
  useEffect(() => {
    if (originDiaries.length > 0) {
      const sorted = [...originDiaries].sort((a, b) => {
        const dateA = formatDate(a.date as string);
        const dateB = formatDate(b.date as string);

        //정렬:최신순
        if (selectedBox === "최신순") {
          return +dateB - +dateA;
        }
        //정렬:오래된순
        else if (selectedBox === "오래된순") {
          return +dateA - +dateB;
        }
        return 0; // **REVIEW - 기본값: 정렬 기준이 없으면 0을 반환 (변경하지 않음)
      });
      setSortedDiaries(sorted);
    }
  }, [selectedBox, originDiaries]); //originDiaries?

  useEffect(() => {
    let fetching = false;
    const handleScroll = async (e) => {
      const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement;
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
      <div className="p-4 border-2 rounded-xl">
        <Tab.Group>
          <div className="flex justify-between h-[70px]">
            <div>
              <Select name="status" aria-label="Project status" onChange={(e) => setSelectedBox(e.target.value)}>
                <option value="최신순">최신순</option>
                <option value="오래된순">오래된순</option>
              </Select>
            </div>
            <div>
              <Tab.List>
                <Tab className="pr-2">피드</Tab>
                <Tab>목록</Tab>
              </Tab.List>
            </div>
          </div>
          <div className="flex gap-2 mb-4 justify-end">
            <Link href={"/"}>
              <div className="border-2 rounded-3xl p-2 text-sm">날짜별 일기</div>
            </Link>
            <Link href={"/library"}>
              <div className="border-2 rounded-3xl p-2 text-sm">내 서재</div>
            </Link>
            <Link href={"/diary/write"}>
              <div className="border-2 rounded-3xl p-2 text-sm">일기 쓰러가기</div>
            </Link>
          </div>
          <Tab.Panels>
            {/* 피드 클릭 시 */}
            <Tab.Panel>
              {sortedDiaries?.map((diary) => (
                <div key={diary.id} className="p-4 mb-2 border-2 rounded-lg">
                  <div>
                    <div className="mb-2 border-2 h-[200px] rounded-lg flex gap-2">
                      <img src={diary.draw} width={700} height={700} alt="Picture of the author" />
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm">
                        <p>{getDayOfTheWeek(diary.date)}</p>
                        <p>{diary.date}</p>
                      </div>
                      <div>{diary.emotion}</div>
                    </div>
                    <p>{diary.contents}</p>
                  </div>
                </div>
              ))}
            </Tab.Panel>
            {/* 목록 클릭 시 */}
            <Tab.Panel>
              {sortedDiaries?.map((diary) => (
                <div key={diary.id} className="p-2 mb-2 border-2 flex rounded-lg">
                  <div className="mr-4 border-2 h-[50px] w-[50px]">
                    <img src={diary.draw} width={50} height={50} alt="Picture of the author" />
                  </div>
                  <div>
                    <p>{diary.title}</p>
                    <p className="text-sm">{diary.date}</p>
                  </div>
                </div>
              ))}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <TopButton />
    </div>
  );
};

export default DiaryList;
