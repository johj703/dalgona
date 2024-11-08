"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Calendar from "./calendar/Calendar";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import DiaryList from "./DiaryList";
import Link from "next/link";
import search from "../../../public/images/main/search.png";
import Image from "next/image";

const OPTIONS: EmblaOptionsType = {};
const SLIDES = [{ img: "/icons/banner1.svg" }, { img: "/icons/banner2.svg" }];

const SelectFeedCalendar = () => {
  return (
    <div>
      <TabGroup>
        <TabList className="top flex py-[24px] px-[16px] justify-between items-center self-stretch">
          <div className="flex items-center gap-[16px]">
            <Tab className="text-[20px] not-italic font-[400] leading-[27px] data-[selected]:text-black text-[#A6A6A6]">
              피드
            </Tab>
            <Tab className="text-[20px] not-italic font-[400] leading-[27px] data-[selected]:text-black text-[#A6A6A6]">
              달력보기
            </Tab>
          </div>
          <div>
            <Link href={"/main/search"}>
              <Image src={search} width={24} height={24} alt="search" />
            </Link>
          </div>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div>
              <EmblaCarousel slides={SLIDES} options={OPTIONS} />
              <DiaryList />
            </div>
          </TabPanel>
          <TabPanel>
            <Calendar />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default SelectFeedCalendar;

{
  /* <div className="flex gap-[16px] items-center">
<Tab className="text-[20px] not-italic font-[400] leading-[27px]">피드</Tab>
<Tab className="text-[20px] not-italic font-[400] leading-[27px]">달력보기</Tab>
</div> */
}
