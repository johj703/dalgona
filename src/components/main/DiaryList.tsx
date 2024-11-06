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
import { getEmoji } from "@/utils/diary/getEmoji";

//TODO - next.js 이미지 최적화
//TODO - 로그인 한 유저만
//TODO - 쓰로틀링 적용

const DiaryList = () => {
  const [originDiaries, setOriginDiaries] = useState<SortedDiaries[]>([]);
  const [sortedDiaries, setSortedDiaries] = useState<SortedDiaries[]>([]);
  const [selectedBox, setSelectedBox] = useState<string>("최신순");
  // const [throttle, setThrottle] = useState<boolean>(false);

  const { data: diaries, hasNextPage, fetchNextPage } = useInfiniteQueryDiaries();
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
        return 0;
      });
      setSortedDiaries(sorted);
    }
  }, [selectedBox, originDiaries]);

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
    <>
      {sortedDiaries && sortedDiaries.length > 0 ? (
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
                  <div className="border-[1px] rounded-2xl border-black py-[10px] px-[16px] bg-[#FDF7F4] text-[12px] not-italic font-[400] leading-[18px]">
                    일기 쓰러가기
                  </div>
                </Link>
                <Link href={"/library"}>
                  <div className="border-[1px] rounded-2xl border-black py-[10px] px-[16px] bg-[#FDF7F4] text-[12px] not-italic font-[400] leading-[18px]">
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
                        <p className="title self-stretch text-[18px] not-italic font-[400] leading-[24.3px]">
                          {diary.title}
                        </p>
                        <img
                          src={diary.draw}
                          width={700}
                          height={700}
                          alt="Picture of the author"
                          className="img border-[1px] rounded-lg border-black h-[238px] my-[10px] bg-white "
                        />
                        <div className="absolute w-[269px] top-[46.5px] flex justify-between items-center mx-[15px]">
                          <div className="w-[50px] text-sm">
                            <p className="today text-center border-b-2">{getDayOfTheWeek(diary.date)}</p>
                            <p className="simple-date text-center">{getSimpleFullDate(diary.date).substring(2)}</p>
                          </div>
                          <div>
                            <img src={getEmoji(diary.emotion, "on")} alt={diary.emotion} className="w-10 h-10 mt-1" />
                          </div>
                        </div>
                        <p className="content h-[45px] self-stretch overflow-hidden text-ellipsis  whitespace-nowrap font-['Dovemayo'] text-[14px] not-italic font-[500] leading-[21px]">
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
                      className="h-[88px] py-[11px] px-[14px] mb-[16px] border-[1px] rounded-lg border-black flex bg-[#FDF7F4]"
                    >
                      <img
                        src={diary.draw}
                        width={60}
                        height={60}
                        alt="Picture of the author"
                        className="border-[1px] rounded-lg border-black mr-[16px] bg-white"
                      />
                      <div className="w-[222px]">
                        <p className="self-stretch text-[16px] not-italic font-normal leading-[21.6px]">
                          {diary.title}
                        </p>
                        <p className="h-[20px] self-stretch overflow-hidden text-ellipsis whitespace-nowrap text-[14px] not-italic font-medium leading-[21px]">
                          {diary.contents}
                        </p>
                        <p className="self-stretch text-[12px] not-italic font-medium leading-[18px]">
                          {getSimpleFullDate(diary.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
          <TopButton />
        </div>
      ) : (
        <div className="pt-[6px]">
          <div className="my-[8px] mx-[16px] py-[159px] px-[67px] border-2 rounded-2xl border-black bg-[#EFE6DE]">
            <div className="flex flex-col justify-center items-center gap-[23px]">
              <div>
                <div className="flex gap-[10px] p-[10px]">
                  <p className="text-[16px] not-italic font-[400]	leading-normal">아직 작성된 일기가 없어요</p>
                  <img src="/icons/facial-expressions.svg" width={20.75} height={20} alt="facial-expressions" />
                </div>
                <p className="text-[#A6A6A6] text-[14px] not-italic font-[400] leading-[21px] text-center">
                  오늘의 첫 이야기를 남겨보세요
                </p>
              </div>
              <div>
                <button className="flex gap-[10px] py-[12px] px-[16px] bg-white rounded-2xl border-[1px] border-black ">
                  <p>일기 쓰러가기</p> <img src="/icons/pencil.svg" width={24} height={24} alt="pencil" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiaryList;
