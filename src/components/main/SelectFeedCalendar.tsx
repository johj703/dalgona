"use client";
import { Tab } from "@headlessui/react";
import React from "react";
import Calendar from "./Calendar";

const SelectFeedCalendar = () => {
  return (
    <div>
      <Tab.Group>
        <Tab.List>
          <Tab className="pr-2">피드</Tab>
          <Tab>달력보기</Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>자동으로 넘어가는 배너있어야함</Tab.Panel>
          <Tab.Panel>
            <Calendar />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SelectFeedCalendar;
