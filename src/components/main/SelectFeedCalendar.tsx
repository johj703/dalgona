"use client";
import { Tab } from "@headlessui/react";
import Calendar from "./calendar/Calendar";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import DiaryList from "./DiaryList";

const OPTIONS: EmblaOptionsType = {};
const SLIDE_COUNT = 3;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const SelectFeedCalendar = () => {
  return (
    <div>
      <Tab.Group>
        <Tab.List>
          <div className="my-4 flex gap-4">
            <Tab>피드</Tab>
            <Tab>달력보기</Tab>
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