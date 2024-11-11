"use client";
import { Tab } from "@headlessui/react";
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
      <Tab.Group>
        <Tab.List>
          <div className="flex py-[24px] px-[24] justify-between items-center self-stretch">
            <div className="flex gap-[10px] items-center">
              <Tab className="text-[20px] not-italic font-[400] leading-[27px]">피드</Tab>
              <Tab className="text-[20px] not-italic font-[400] leading-[27px]">달력보기</Tab>
            </div>
            <div>
              <Link href={"/main/search"}>
                <Image src={search} width={24} height={24} alt="Picture of the author" />
              </Link>
            </div>
          </div>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div>
              <EmblaCarousel slides={SLIDES} options={OPTIONS} />
              <DiaryList />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <Calendar />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SelectFeedCalendar;
