import { Dates } from "@/types/main/Calendar";
import { getDayOfTheWeek, getMonthKo, getSimpleDate, getSimpleFullDate } from "@/utils/calendar/dateFormat";
import { getEmoji } from "@/utils/diary/getEmoji";
import Link from "next/link";
import React from "react";

const DiarySelectedList = ({ rangeList, selectedDate }: Dates) => {
  const today = new Date();
  const dayOfWeek = selectedDate.getDay();
  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const year = selectedDate.getFullYear().toString().substring(2);
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  return (
    <>
      {rangeList && rangeList.length > 1 ? (
        <div className="my-[8px] mx-[16px] py-[20px] px-[16px] border-2 rounded-2xl border-black bg-[#EFE6DE] mb-[100px]">
          {rangeList.map((diary) => {
            return (
              <Link href={`/diary/read/${diary.id}`} key={diary.id}>
                <div key={diary.id} className=" border rounded-lg bg-[#FDF7F4] border-black p-4 mb-[10px]">
                  {diary.draw && (
                    <>
                      <h3 className="title self-stretch text-[18px] not-italic font-[400] leading-[24.3px]">
                        {diary.title}
                      </h3>
                      <div className="relative h-48 border border-black flex items-center justify-center mb-2 rounded-lg overflow-hidden  my-[10px]">
                        <img src={diary.draw} alt="그림" className="object-cover h-full w-full bg-white" />
                        <div className="absolute top-[10px] left-[10px] right-[10px] flex justify-between items-center">
                          <div className="w-[50px] text-sm">
                            <p className="today text-center border-b-2">{getDayOfTheWeek(diary.date)}</p>
                            <p className="simple-date text-center">{getSimpleFullDate(diary.date).substring(2)}</p>
                          </div>
                          <div>
                            <img src={getEmoji(diary.emotion, "on")} alt={diary.emotion} className="w-10 h-10 mt-1" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {!diary.draw && (
                    <div className="flex justify-between items-start mb-[8px]">
                      <p className="self-stretch text-[16px] not-italic font-normal leading-[21.6px]">{diary.title}</p>
                      <p className="w-12 h-6 text-xs py-1 justify-center items-center inline-flex bg-white border border-black rounded-2xl text-black">
                        {getMonthKo(diary.date)}
                      </p>
                    </div>
                  )}

                  <p className="text-gray-700 line-clamp-2 text-[14px] font-[500] font-['Dovemayo']">
                    {diary.contents}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : rangeList && rangeList.length === 1 ? (
        <div className="my-[8px] mx-[16px] py-[20px] px-[16px] border-2 rounded-2xl border-black bg-[#EFE6DE] mb-[100px]">
          {rangeList.map((diary) => (
            <Link href={`/diary/read/${diary.id}`} key={diary.id}>
              <div key={diary.id} className="flex flex-col gap-[24px]">
                <div className="flex flex-col justify-center items-center gap-[23px]">
                  <div className="font-['LeferiBaseType-RegularA' text-[16px] font-[400]">내가 남긴 이야기</div>
                  <div className="text-center">
                    <p className="today text-[14px] not-italic font-[400] leading-[21px] pb-[4px] border-b-[1px] border-black">
                      {getDayOfTheWeek(rangeList[0].date)}
                    </p>
                    <p className="simple-date text-[14px] not-italic font-[400] leading-[21px] mt-[4px]">
                      {getSimpleDate(rangeList[0].date)}
                    </p>
                  </div>
                </div>

                {diary.draw && (
                  <div className="feed pt-[18px] px-[16px] pb-[19px] h-[364px] flex flex-col justify-center items-center border-[1px] rounded-2xl border-black bg-[#FDF7F4] relative">
                    <p className="title self-stretch text-[18px] not-italic font-[400] leading-[24.3px] mb-[10px]">
                      {diary.title}
                    </p>
                    <img
                      src={diary.draw}
                      alt="그림"
                      className="img object-cover border-[1px] rounded-lg border-black h-[238px] w-[100%] bg-white mb-[10px]"
                    />
                    <div className="absolute top-[75px] right-[25px]">
                      <img src={getEmoji(diary.emotion, "on")} alt={diary.emotion} className="w-[40px] h-[40px] " />
                    </div>

                    <p className="content self-stretch overflow-hidden text-ellipsis  whitespace-nowrap font-['Dovemayo'] text-[14px] not-italic font-[500] leading-[21px]">
                      {diary.contents}
                    </p>
                  </div>
                )}

                {!diary.draw && (
                  <div className=" border rounded-lg bg-[#FDF7F4] border-black p-4 mb-[10px]">
                    <div className="flex justify-between items-start mb-[8px]">
                      <p className="self-stretch text-[16px] not-italic font-normal leading-[21.6px]">{diary.title}</p>
                      <p className="w-12 h-6 text-xs py-1 justify-center items-center inline-flex bg-white border border-black rounded-2xl text-black">
                        {getMonthKo(diary.date)}
                      </p>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{diary.contents}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="my-[8px] mx-[16px] py-[159px]  border-2 rounded-2xl border-black bg-[#EFE6DE] mb-[100px] lg:m-0 lg:p-0 lg:w-[100%] lg:h-[856px] lg:flex lg:flex-col lg:justify-center lg:mt-[45px] lg:relative">
          <div className="flex flex-col justify-center items-center gap-[23px]">
            {selectedDate > today ? (
              <div>
                <div className="flex gap-[10px] p-[10px]">
                  <p className="text-[16px] not-italic font-[400]	leading-normal lg:text-[20px]">
                    아직 다가오지 않은 날이에요
                  </p>
                  <img src="/icons/clock.svg" width={21} height={21} alt="clock" />
                </div>
                <p className="text-[#A6A6A6] text-[14px] not-italic font-[400] leading-[21px] text-center lg:text-[18px]">
                  그 날이 오면 새로운 이야기를 시작해 봐요
                </p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex gap-[10px] p-[10px] lg:items-center">
                    <p className="text-[16px] not-italic font-[400]	leading-normal lg:text-[20px]">
                      아직 작성된 일기가 없어요
                    </p>
                    <img src="/icons/group-1000005726.svg" width={17} height={21} alt="group-1000005726" />
                  </div>
                  <p className="text-[#A6A6A6] text-[14px] not-italic font-[400] leading-[21px] text-center lg:text-[18px]">
                    하루의 소중한 기록을 남겨보세요
                  </p>
                </div>
                <div>
                  <Link href={"/diary/write"}>
                    <button className="flex gap-[10px] py-[12px] px-[16px] bg-white rounded-2xl border-[1px] border-black ">
                      <p className="lg:text-[16px]">일기 쓰러가기</p>{" "}
                      <img src="/icons/pencil.svg" width={20} height={20} alt="pencil" />
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="hidden lg:block lg:flex flex-col items-center gap-[23px] absolute top-[-140px] left-[250px]">
            <div className="font-['LeferiBaseType-RegularA' text-[20px] font-[400]">내가 남긴 이야기</div>
            <div className="text-center">
              <p className="today text-[14px] not-italic font-[400] leading-[21px] pb-[4px] border-b-[1px] border-black">
                {dayNames[dayOfWeek]}
              </p>
              <p className="simple-date text-[14px] not-italic font-[400] leading-[21px] mt-[4px]">
                {`${year}.${month}.${day}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiarySelectedList;
