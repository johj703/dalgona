import { Dates } from "@/types/main/Calendar";
import { getDayOfTheWeek, getSimpleDate } from "@/utils/calendar/dateFormat";
import Link from "next/link";
import React from "react";

const DiarySelectedList = ({ rangeList, selectedDate }: Dates) => {
  const today = new Date();

  return (
    <>
      <div className="border-2 rounded-lg p-4">
        {rangeList && rangeList.length > 0 ? (
          rangeList.map((list) => (
            <div key={list.id}>
              <div className="justify-items-center">
                <div className="font-bold">내가 남긴 이야기</div>
                <div className="text-sm w-[60px] ">
                  <p className="today text-center border-b-2">{getDayOfTheWeek(rangeList[0].date)}</p>
                  <p className="simple-date text-center">{getSimpleDate(rangeList[0].date)}</p>
                </div>
              </div>
              <div className=" p-4 mb-4 border-2 rounded-lg">
                <div>
                  <div className="mb-2 border-2 h-[200px] rounded-lg flex gap-2">
                    <img src={list.draw} width={700} height={700} alt="Picture of the author" />
                  </div>
                  <p>{list.title}</p>
                  <p>{list.contents}</p>
                </div>
              </div>
            </div>
          ))
        ) : selectedDate > today ? (
          <div>
            <p>아직 다가오지 않은 날이에요🥹</p>
            <p>그 날이 오면 새로운 이야기를 시작해 봐요</p>
          </div>
        ) : (
          <div className="flex justify-center items-center m-2 p-12 border-2">
            <div>
              <p>작성된 일기가 없어요🥹</p>
              <p>하루의 소중한 기록을 남겨보세요</p>
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
