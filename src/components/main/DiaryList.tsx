"use client";
import { useFetchDiaries } from "@/queries/fetchDiaries";
import { Listbox, Tab } from "@headlessui/react";
import React, { useEffect, useState } from "react";

const sorts = [
  { id: 1, name: "최신순", unavailable: false },
  { id: 2, name: "오래된순", unavailable: false }
];

// yyyy년 mm월 dd일 -> yyyy-mm-dd로 변환 & Date 객체로 변환
const formatDate = (date: string) => {
  const [year, month, day] = date
    .replace("년", "")
    .replace("월", "")
    .replace("일", "")
    .split(" ")
    .map((str) => parseInt(str.trim(), 10));
  return new Date(year, month - 1, day);
};

type SortedDiaries = {
  id: string;
  created_at: string;
  title: string;
  contents: string;
  draw: string;
  date: string;
  emotion: string;
  user_id: string;
};

const DiaryList = () => {
  const [selectedBox, setSelectedBox] = useState(sorts[0]);
  const [sortedDiaries, setSortedDiaries] = useState<SortedDiaries[]>([]);

  //prefetchQuery를 통해 캐시에 미리 저장된 데이터가 있으니, 새롭게 데이터를 가져오지 않고 캐시에 저장된 데이터를 반환
  const { data: diaries, error, isLoading } = useFetchDiaries();
  if (error) return console.error("일기를 불러오는데 오류가 발생하였습니다." + error);
  if (isLoading) return console.error("로딩중입니다.");

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
      });
      setSortedDiaries(sorted); // 정렬된 데이터 설정
    }
  }, [selectedBox, diaries]); // selectedBox나 diaries가 변경될 때마다 실행

  return (
    <div>
      <div className="">
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
      <div></div>
      <div></div>
    </div>
  );
};

export default DiaryList;
