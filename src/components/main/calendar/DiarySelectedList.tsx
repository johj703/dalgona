import { Dates } from "@/types/main/Calendar";
import Link from "next/link";
import React from "react";

//NOTE - 일기 데이터
const DiarySelectedList = ({ rangeList }: Dates) => {
  return (
    <>
      {rangeList && rangeList.length > 0 ? (
        rangeList.map((list) => (
          <div key={list.id}>
            <div className="p-4 mb-2 border-2">
              <div>
                <div className="border-2 h-[200px]">
                  이미지
                  <span>{list.date}</span>
                </div>
                <p className="border-2 my-2">{list.contents}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center m-2 p-12 border-2">
          <div>
            <p>작성된 일기가 없어요🥹</p>
            <p>이야기를 기록해보세요</p>
            <Link href={"/diary/write"}>
              <div className="px-4 py-2 rounded bg-gray-200 text-sm text-black">일기 쓰러가기</div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default DiarySelectedList;
