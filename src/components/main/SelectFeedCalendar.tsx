"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Calendar from "./calendar/Calendar";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import DiaryList from "./DiaryList";
import Link from "next/link";
import search from "../../../public/images/main/search.png";
import Image from "next/image";
import WebDiaryList from "./web/WebDiaryList";
import { useState } from "react";

const OPTIONS: EmblaOptionsType = {};
const SLIDES = [
  { img: "/images/banner-short-1.svg", imgLg: "/images/banner-long-1.svg" },
  { img: "/images/banner-short-2.svg", imgLg: "/images/banner-long-2.svg" }
];

const SelectFeedCalendar = () => {
  // 현재 선택된 탭 상태관리
  const [isSelectTap, setIsSelectTap] = useState(0);
  return (
    <div>
      <TabGroup onChange={(idx) => setIsSelectTap(idx)}>
        <TabList className="top flex py-[24px] px-[16px] lg:pl-[15px] justify-between items-center self-stretch lg:px-0 lg:pt-[34px]">
          <div className="flex items-center gap-[16px] ld:h-[54px] lg:gap-[4px] lg:rounded-2xl lg:bg-[#F2F2F2] lg:border-[2px] lg:border-black">
            <Tab className="text-[20px] not-italic font-[400] leading-[27px] data-[selected]:text-black text-[#A6A6A6] lg:rounded-xl lg:p-[10px] lg:text-[20px] lg:font-[400] lg:text-[#8C8C8C] lg:data-[selected]:text-white lg:data-[selected]:bg-[#F2693B] lg:data-[selected]:border-[2px] lg:data-[selected]:border-black lg:w-[90px] outline-none">
              피드
            </Tab>
            <Tab className="text-[20px] not-italic font-[400] leading-[27px] data-[selected]:text-black text-[#A6A6A6] lg:rounded-xl lg:p-[10px] lg:text-[20px] lg:font-[400] lg:text-[#8C8C8C] lg:data-[selected]:text-white lg:data-[selected]:bg-[#F2693B] lg:data-[selected]:border-[2px] lg:data-[selected]:border-black lg:w-[90px] outline-none">
              달력보기
            </Tab>
          </div>
          <div className="lg:hidden">
            <Link href={"/main/search"}>
              <Image src={search} width={24} height={24} alt="search" />
            </Link>
          </div>
        </TabList>
        <TabPanels>
          <TabPanel className="flex flex-col items-start gap-[6px] shrink-0">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} isSelectCalendar={isSelectTap} />
            <DiaryList />
            <WebDiaryList />
          </TabPanel>
          <TabPanel>
            <Calendar isSelectCalendar={isSelectTap} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default SelectFeedCalendar;
