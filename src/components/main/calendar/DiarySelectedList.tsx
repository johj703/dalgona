import { Dates } from "@/types/main/Calendar";
import Link from "next/link";
import React from "react";

//NOTE - 일기 데이터
const DiarySelectedList = ({ rangeList }: Dates) => {
  return (
    <>
      <div className="border-2 rounded-lg p-4">
        <p className="font-bold text-center py-[10px]">내가 남긴 이야기</p>
        {rangeList && rangeList.length > 0 ? (
          rangeList.map((list) => (
            <div key={list.id} className="p-4 mb-4 border-2 rounded-lg">
              <div>
                <div className="mb-2 border-2 h-[200px] rounded-lg flex gap-2">
                  <img src={list.draw} width={700} height={700} alt="Picture of the author" />
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">
                    <p>{list.date}</p>
                  </div>
                  <div>{list.emotion}</div>
                </div>
                <p>{list.contents}</p>
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
      </div>
    </>
  );
};

export default DiarySelectedList;
