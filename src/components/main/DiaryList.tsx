"use client";
import { useFetchDiaries } from "@/queries/fetchDiaries";
import { Listbox, Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import TopButton from "./TopButton";
import { formatDate } from "@/utils/calendar/dateFormat";
import { SortedDiaries } from "@/types/main/Calendar";

const sorts = [
  { id: 1, name: "최신순", unavailable: false },
  { id: 2, name: "오래된순", unavailable: false }
];

const DiaryList = (): JSX.Element => {
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

  // if (error) return console.error("일기를 불러오는데 오류가 발생하였습니다." + error);
  // if (isLoading) return console.error("로딩중입니다.");

  return (
    <div>
      <div>
        <div>
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
                  <Tab className="pr-2">네모아이콘</Tab>
                  <Tab>목록아이콘</Tab>
                </Tab.List>
              </div>
            </div>
            <Tab.Panels>
              <Tab.Panel>
                {sortedDiaries?.map((diary) => (
                  <div key={diary.id} className="p-2 mb-2 border-2">
                    <div className="">
                      <div className="border-2 h-[200px]">
                        이미지
                        <span>{diary.date}</span>
                      </div>
                      <p className="border-2 my-2">{diary.contents}</p>
                    </div>
                  </div>
                ))}
              </Tab.Panel>
              <Tab.Panel>
                {sortedDiaries?.map((diary) => (
                  <div key={diary.id} className="p-2 mb-2 border-2 flex">
                    <div className="mr-4 border-2">이미지</div>
                    <div>
                      <p>{diary.title}</p>
                      <p>{diary.date}</p>
                    </div>
                  </div>
                ))}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      <TopButton />
    </div>
  );
};

export default DiaryList;
