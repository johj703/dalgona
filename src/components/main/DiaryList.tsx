"use client";
import { useFetchDiaries } from "@/queries/fetchDiaries";
import { Listbox, Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import TopButton from "./TopButton";
import { formatDate, getDayOfTheWeek } from "@/utils/calendar/dateFormat";
import { SortedDiaries } from "@/types/main/Calendar";
import Link from "next/link";
// import Image from "next/image";

const sorts = [
  { id: 1, name: "최신순", unavailable: false },
  { id: 2, name: "오래된순", unavailable: false }
];

//TODO - 감정이미지 가져오기
//TODO - next.js 이미지 최적화
//TODO - 무한스크롤

const DiaryList = () => {
  const [sortedDiaries, setSortedDiaries] = useState<SortedDiaries[]>([]);
  const [selectedBox, setSelectedBox] = useState(sorts[0]);

  //prefetchQuery를 통해 캐시에 미리 저장된 데이터가 있으니, 새롭게 데이터를 가져오지 않고 캐시에 저장된 데이터를 반환
  const { data: diaries } = useFetchDiaries();

  // 선택한 정렬 기준에 따라 일기를 정렬
  useEffect(() => {
    if (diaries) {
      const sorted = [...diaries].sort((a, b) => {
        const dateA = formatDate(a.date);
        const dateB = formatDate(b.date);

        //정렬:최신순
        if (selectedBox.id === 1) {
          return +dateB - +dateA;
        }
        //정렬:오래된순
        else if (selectedBox.id === 2) {
          return +dateA - +dateB;
        }
        return 0; // **REVIEW - 기본값: 정렬 기준이 없으면 0을 반환 (변경하지 않음)
      });
      setSortedDiaries(sorted);
    }
  }, [selectedBox, diaries]); // selectedBox나 diaries가 변경될 때마다 실행

  return (
    <div>
      <div className="p-4 border-2 rounded-xl">
        <Tab.Group>
          <div className="flex justify-between h-[70px]">
            <div>
              <Listbox value={selectedBox} onChange={setSelectedBox}>
                <Listbox.Button>{selectedBox.name}</Listbox.Button>
                <Listbox.Options>
                  {sorts.map((sort) => (
                    <Listbox.Option key={sort.id} value={sort} disabled={sort.unavailable}>
                      {sort.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
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
