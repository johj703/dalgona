"use client";
import { useInfiniteQueryDiaries } from "@/lib/main/fetchDiaries";
import { Select, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { formatDate, getDayOfTheWeek, getMonthKo, getSimpleFullDate } from "@/utils/calendar/dateFormat";
import { SortedDiaries } from "@/types/main/Calendar";
import Link from "next/link";
import { getEmoji } from "@/utils/diary/getEmoji";
import TopButton from "../TopButton";
import getLoginUser from "@/lib/getLoginUser";

//TODO - next.js 이미지 최적화
//TODO - 쓰로틀링 적용

const DiaryList = () => {
  const [originDiaries, setOriginDiaries] = useState<SortedDiaries[]>([]);
  const [sortedDiaries, setSortedDiaries] = useState<SortedDiaries[]>([]);
  const [selectedBox, setSelectedBox] = useState<string>("최신순");
  const [activeTab, setActiveTab] = useState("feed");
  const [userId, setUserId] = useState<string>("");

  const { data: diaries, hasNextPage, fetchNextPage } = useInfiniteQueryDiaries(userId);
  const originList = diaries?.pages.flatMap((page) => page.diariesList) || [];

  useEffect(() => {
    // userId를 가져오는 함수 실행
    const fetchUserId = async () => {
      const data = await getLoginUser();
      if (data) setUserId(data.id);
    };
    fetchUserId();
  }, []);

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
        <div className="flex py-[8px] px-[16px] items-center gap-[10px] self-stretch">
          <div className="all-feed flex w-full py-[20px] px-[16px] mb-[70px] flex-col items-center gap-[10px] border-2 rounded-2xl border-black bg-[#EFE6DE]">
            <TabGroup className="w-full">
              <div className="flex mb-[16px] justify-between">
                <div className="w-[75px] h-[36px] p-[10px]">
                  <Select
                    name="status"
                    aria-label="Project status"
                    onChange={(e) => setSelectedBox(e.target.value)}
                    className="bg-[#EFE6DE] text-base"
                  >
                    <option
                      value="최신순"
                      className="text-[12px] not-italic font-[400] leading-[18px] bg-[#EFE6DE] w-[75px] h-[36px] p-[10px]"
                    >
                      최신순
                    </option>
                    <option
                      value="오래된순"
                      className="text-[12px] not-italic font-[400] leading-[18px] bg-[#EFE6DE] w-[75px] h-[36px] p-[10px]"
                    >
                      오래된순
                    </option>
                  </Select>
                </div>
                <div className="flex gap-[14px]">
                  <TabList>
                    <Tab className="pr-2" onClick={() => setActiveTab("feed")}>
                      {activeTab === "feed" ? (
                        <img src="/icons/feed-selected.svg" width={24} height={24} alt="feed" />
                      ) : (
                        <img src="/icons/feed-non-selected.svg" width={24} height={24} alt="feed" />
                      )}
                    </Tab>
                    <Tab onClick={() => setActiveTab("list")}>
                      {activeTab === "list" ? (
                        <img src="/icons/list.svg" width={24} height={24} alt="list" />
                      ) : (
                        <img src="/icons/list-non-selected.svg" width={24} height={24} alt="list" />
                      )}
                    </Tab>
                  </TabList>
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
              <TabPanels>
                {/* 피드 클릭 시 */}
                <TabPanel>
                  {sortedDiaries?.map((diary) =>
                    diary.draw ? (
                      <Link href={`/diary/read/${diary.id}`} key={diary.id}>
                        <div key={diary.id} className=" border rounded-lg bg-[#FDF7F4] border-black p-4 mb-[16px]">
                          {diary.draw && (
                            <>
                              <h3 className="title self-stretch text-[18px] not-italic font-[400] leading-[24.3px]">
                                {diary.title}
                              </h3>
                              <div className="relative h-[238px] border border-black flex items-center justify-center mb-2 rounded-lg overflow-hidden  my-[10px]">
                                <img src={diary.draw} alt="그림" className="object-cover h-full w-full bg-white" />
                                <div className="absolute top-[10px] left-[10px] right-[10px] flex justify-between items-center">
                                  <div className="w-[50px] text-sm">
                                    <p className="today text-center border-b-2">{getDayOfTheWeek(diary.date)}</p>
                                    <p className="simple-date text-center">
                                      {getSimpleFullDate(diary.date).substring(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <img
                                      src={getEmoji(diary.emotion, "on")}
                                      alt={diary.emotion}
                                      className="w-10 h-10 mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          <p className=" text-[14px] font-[500] line-clamp-2 font-['Dovemayo'] ">{diary.contents}</p>
                        </div>
                      </Link>
                    ) : (
                      <Link href={`/diary/read/${diary.id}`} key={diary.id}>
                        <div
                          key={diary.id}
                          className="h-[88px] py-[11px] px-[14px] mb-[16px] border-[1px] rounded-lg border-black bg-[#FDF7F4]"
                        >
                          <div className="flex justify-between items-start">
                            <p className="self-stretch text-[16px] not-italic font-normal leading-[21.6px]">
                              {diary.title}
                            </p>
                            <p className="w-12 h-6 text-xs py-1 justify-center items-center inline-flex bg-white border border-black rounded-2xl text-black">
                              {getMonthKo(diary.date)}
                            </p>
                          </div>
                          <p className="mt-[8px] h-[20px] self-stretch overflow-hidden text-ellipsis whitespace-nowrap text-[14px] not-italic font-['Dovemayo'] font-medium leading-[21px]">
                            {diary.contents}
                          </p>
                        </div>
                      </Link>
                    )
                  )}
                </TabPanel>
                {/* 목록 클릭 시 */}
                <TabPanel>
                  {sortedDiaries?.map((diary) =>
                    diary.draw ? (
                      <Link href={`/diary/read/${diary.id}`} key={diary.id}>
                        <div
                          key={diary.id}
                          className="h-[88px] py-[11px] px-[14px] mb-[16px] border-[1px] rounded-lg border-black flex bg-[#FDF7F4]"
                        >
                          <img
                            src={diary.draw}
                            width={60}
                            height={60}
                            alt="그림"
                            className="border-[1px] rounded-lg border-black mr-[16px] object-cover bg-white w-[60px] h-[60px] flex-shrink-0"
                          />
                          <div className="w-[222px]">
                            <p className="self-stretch text-[16px] not-italic font-normal leading-[21.6px]">
                              {diary.title}
                            </p>
                            <p className="h-[20px] self-stretch overflow-hidden text-ellipsis whitespace-nowrap text-[14px] not-italic font-[500] leading-[21px] font-['Dovemayo'] my-[2px]">
                              {diary.contents}
                            </p>
                            <p className="self-stretch text-[12px] not-italic font-medium leading-[18px]">
                              {getSimpleFullDate(diary.date)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link href={`/diary/read/${diary.id}`} key={diary.id}>
                        <div
                          key={diary.id}
                          className="h-[88px] py-[11px] px-[14px] mb-[16px] border-[1px] rounded-lg border-black bg-[#FDF7F4]"
                        >
                          <div className="flex justify-between items-start">
                            <p className="self-stretch text-[16px] not-italic font-normal leading-[21.6px]">
                              {diary.title}
                            </p>
                            <p className="w-12 h-6 text-xs py-1 justify-center items-center inline-flex bg-white border border-black rounded-2xl text-black">
                              {getMonthKo(diary.date)}
                            </p>
                          </div>
                          <p className="mt-[8px] h-[20px] self-stretch overflow-hidden text-ellipsis whitespace-nowrap text-[14px] not-italic  font-[500] font-['Dovemayo'] leading-[21px]">
                            {diary.contents}
                          </p>
                        </div>
                      </Link>
                    )
                  )}
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
          <TopButton />
        </div>
      ) : (
        <div className="flex py-[8px] px-[16px] items-center gap-[10px] self-stretch">
          <div className="flex w-full h-[468px] py-[159px] flex-col items-center gap-[10px] border-2 rounded-2xl border-black bg-[#EFE6DE]">
            <div className="flex flex-col justify-center items-center gap-[23px]">
              <div>
                <Link href={"/diary/write"}>
                  <div className="flex gap-[10px] p-[10px]">
                    <p className="text-[16px] not-italic font-[400]	leading-normal">아직 작성된 일기가 없어요</p>
                    <img src="/icons/group-1000005726.svg" width={17} height={21} alt="group-1000005726" />
                  </div>
                </Link>
                <p className="text-[#A6A6A6] text-[14px] not-italic font-[400] leading-[21px] text-center">
                  오늘의 첫 이야기를 남겨보세요
                </p>
              </div>
              <div>
                <Link href={"/diary/write"}>
                  <button className="flex gap-[10px] py-[12px] px-[16px] bg-white rounded-2xl border-[1px] border-black ">
                    <p>일기 쓰러가기</p> <img src="/icons/pencil.svg" width={24} height={24} alt="pencil" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiaryList;
