"use client";
import { Tab } from "@headlessui/react";
import React from "react";
import Calendar from "./Calendar";
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
          <Tab className="pr-2">피드</Tab>
          <Tab>달력보기</Tab>
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
