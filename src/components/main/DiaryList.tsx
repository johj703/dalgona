"use client";
import { useInfiniteQueryDiaries } from "@/lib/main/fetchDiaries";
import { Select, Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import TopButton from "./TopButton";
import { formatDate, getDayOfTheWeek, getSimpleFullDate } from "@/utils/calendar/dateFormat";
import { SortedDiaries } from "@/types/main/Calendar";
import Link from "next/link";
import feedActive from "../../../public/images/main/feed.png";
import listActive from "../../../public/images/main/list.png";
import Image from "next/image";

//TODO - 감정이미지 가져오기
//TODO - next.js 이미지 최적화
//TODO - 로그인 한 유저만
//TODO - 쓰로틀링 적용
//TODO - css - 탭눌렀을때 색유지

const DiaryList = () => {
  const [originDiaries, setOriginDiaries] = useState<SortedDiaries[]>([]);
  const [sortedDiaries, setSortedDiaries] = useState<SortedDiaries[]>([]);
  const [selectedBox, setSelectedBox] = useState<string>("최신순");
  // const [throttle, setThrottle] = useState<boolean>(false);

  //prefetchQuery를 통해 캐시에 미리 저장된 데이터가 있으니, 새롭게 데이터를 가져오지 않고 캐시에 저장된 데이터를 반환
  // const { data: diaries } = useFetchDiaries();
  const { data: diaries, hasNextPage, fetchNextPage } = useInfiniteQueryDiaries();
  //REVIEW -  모든 페이지의 diariesList 데이터를 합쳐서 가져오기
  const originList = diaries?.pages.flatMap((page) => page.diariesList) || [];

  useEffect(() => {
    if (diaries) {
      setOriginDiaries(originList);
      setSortedDiaries(originList);
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
    <div className="pt-[6px]">
      <div className="all-feed my-[8px] mx-[16px] border-[2px] border-black rounded-2xl bg-[#EFE6DE] py-[20px] px-[16px]">
        <Tab.Group>
          <div className="flex mb-[16px] justify-between">
            <div className="w-[75px] h-[36px] p-[10px]">
              <Select
                name="status"
                aria-label="Project status"
                onChange={(e) => setSelectedBox(e.target.value)}
                className="bg-[#EFE6DE] text-base"
              >
                <option value="최신순">최신순</option>
                <option value="오래된순">오래된순</option>
              </Select>
            </div>
            <div className="flex gap-[14px]">
              <Tab.List>
                <Tab className="pr-2">
                  <Image src={feedActive} width={24} height={24} alt="Picture of the author" />
                </Tab>
                <Tab>
                  <Image src={listActive} width={24} height={24} alt="Picture of the author" />
                </Tab>
              </Tab.List>
            </div>
          </div>
          <div className="flex gap-2 justify-end mb-[16px]">
            <Link href={"/diary/write"}>
              <div className="border-[1px] rounded-2xl border-black py-[10px] px-[16px] bg-[#FDF7F4] text-xs	">
                일기 쓰러가기
              </div>
            </Link>
            <Link href={"/library"}>
              <div className="border-[1px] rounded-2xl border-black py-[10px] px-[16px] bg-[#FDF7F4] text-xs	">
                기록의 방
              </div>
            </Link>
          </div>
          <div></div>
          <Tab.Panels>
            {/* 피드 클릭 시 */}
            <Tab.Panel>
              {sortedDiaries?.map((diary) => (
                <div
                  key={diary.id}
                  className="feed pt-[18px] px-[16px] pb-[19px] w-[326px] h-[364px] flex flex-col justify-center items-center border-[1px] rounded-2xl border-black mb-[16px] bg-[#FDF7F4]"
                >
                  <div className="feed-inner relative w-[294px]">
                    <p className="title self-stretch text-[18px] not-italic font-normal leading-[24.3px]">
                      {diary.title}
                    </p>
                    <img
                      src={diary.draw}
                      width={700}
                      height={700}
                      alt="Picture of the author"
                      className="img border-[1px] rounded-lg border-black h-[238px] my-[10px] bg-white"
                    />
                    <div className="absolute w-[269px] top-[46.5px] flex justify-between items-center mx-[15px]">
                      <div className="text-sm">
                        <p className="today text-center border-b-2">{getDayOfTheWeek(diary.date)}</p>
                        <p className="simple-date text-center">{getSimpleFullDate(diary.date)}</p>
                      </div>
                      <div>{diary.emotion}</div>
                    </div>
                    <p className="content h-[45px] self-stretch overflow-hidden text-ellipsis  whitespace-nowrap text-[14px] not-italic font-medium  leading-[21px]">
                      {diary.contents}
                    </p>
                  </div>
                </div>
              ))}
            </Tab.Panel>
            {/* 목록 클릭 시 */}
            <Tab.Panel>
              {sortedDiaries?.map((diary) => (
                <div
                  key={diary.id}
                  className="h-[88px] py-[11px] px-[14px] mb-[16px] border-[1px] rounded-lg border-black flex"
                >
                  <img
                    src={diary.draw}
                    width={60}
                    height={60}
                    alt="Picture of the author"
                    className="border-[1px] rounded-lg border-black mr-[16px]"
                  />
                  <div>
                    <p>{diary.title}</p>
                    <p className="overflow-hidden text-ellipsis h-[20px]">{diary.contents}</p>
                    <p className="h-[18px] text-sm">{getSimpleFullDate(diary.date)}</p>
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
