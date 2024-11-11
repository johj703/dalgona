"use client";
import { getMonthlyEmotion } from "@/lib/mypage/getMonthlyEmotion";
import { getMyDrawing } from "@/lib/mypage/getMyDrawing";
import { getUserData } from "@/lib/mypage/getUserData";
import { UserData } from "@/types/mypage/UserData";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/supabase";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import CommonTitle from "@/components/CommonTitle";
import { EMOTION_LIST, getEmoji } from "@/utils/diary/getEmoji";
import getLoginUser from "@/lib/getLoginUser";
import getGenderIcon from "@/utils/mypage/getGenderIcon";

const DEFAULT_IMAGE = "https://spimvuqwvknjuepojplk.supabase.co/storage/v1/object/public/profile/default_profile.svg";

const Mypage = () => {
  const [userData, setUserData] = useState<UserData>();
  const [monthlyData, setMonthlyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [myDrawing, setMyDrawing] = useState<{ draw: string }[]>();
  const [myDrawingCount, setMyDrawingCount] = useState<number>(0);

  const router = useRouter();

  const getData = async () => {
    const userData = await getLoginUser();
    const UserData = await getUserData(userData!.id);
    const MonthlyData = await getMonthlyEmotion(userData!.id);
    const MyDrawing = await getMyDrawing(userData!.id);

    setUserData(UserData);

    if (MonthlyData) setMonthlyData(MonthlyData);
    if (MyDrawing) {
      setMyDrawing(MyDrawing.data!);
      setMyDrawingCount(MyDrawing.count!);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <CommonTitle title={"마이 페이지"} />
      <div className="py-6">
        <div className="flex gap-[14px] px-4">
          <Image
            src={userData?.profile_image ? userData.profile_image : DEFAULT_IMAGE}
            width={80}
            height={80}
            alt="프로필 이미지"
            className="flex-shrink-0"
          />

          <div className="flex-1 flex flex-col gap-[7px]">
            <div className="flex items-center gap-[7px] text-lg leading-tight">
              {userData?.name} <span className="text-[#7D7D7D]">{userData?.nickname}</span>
            </div>
            <div className="text-sm leading-tight text-[#AEAEAE]">{userData?.email}</div>
            <div className="flex items-center gap-[10px] p-[2px] font-Dovemayo text-sm leading-normal empty:hidden">
              {userData?.birthday && <span>{userData.birthday}</span>}
              {userData?.gender && <img src={getGenderIcon(userData.gender)} alt={userData.gender} />}
              {userData?.bloodtype && <span>{userData.bloodtype}형</span>}
            </div>
          </div>

          <button className="mb-auto" onClick={() => router.push("/mypage/editprofile")}>
            <img src="/icons/setting.svg" alt="마이페이지 수정" />
          </button>
        </div>

        <div className="mt-[19px]">
          <div className="px-4 py-2 text-base leading-5">이번 달 감정 모아보기</div>

          <ul className="flex gap-10 scrollbar-hide px-4 py-[8.5px] overflow-x-auto">
            {EMOTION_LIST.map((emoji, idx) => {
              return (
                <li key={"emoji" + idx} className="flex-shrink-0 flex flex-col items-center gap-1">
                  <img src={getEmoji(emoji, "on")} alt={emoji} className="w-[50px] h-[50px]" />
                  <span className="text-base leading-normal">{monthlyData[idx]}</span>
                  <span className="text-xs leading-5 text-[#414141] font-Dovemayo">{emoji}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="py-2 px-4">
          <div className="text-base leading-5">내 그림 모아보기</div>
          <ul className="flex gap-4 mt-[11px]">
            {myDrawing?.length === 0 && (
              <div className="flex flex-col items-center text-center w-full">
                <div className="flex items-center justify-center gap-[10px] p-[10px] text-base leading-5">
                  아직 그림이 없네요! <img src="/icons/facial-expressions.svg" alt="우는 얼굴" />
                </div>
                <span className="text-sm leading-normal text-gray04">캔버스가 당신의 하루를 기다리고 있어요!</span>
                <Link
                  href={"/diary/write"}
                  className="flex items-center gap-[10px] mt-[34px] w-fit py-2 px-4 border-black border border-solid rounded-lg bg-white"
                >
                  그림 그리러 가기 <img src="/icons/pencil.svg" alt="연필" />
                </Link>
              </div>
            )}
            {myDrawing?.map((draw, idx) => {
              return (
                <li
                  key={idx}
                  className="relative flex items-center justify-center w-1/3 aspect-square border border-[#D9D9D9] rounded-2xl bg-white overflow-hidden"
                >
                  <img src={draw.draw} alt={`그림${idx}`} className="object-contain" />

                  {idx === myDrawing.length - 1 && (
                    <Link
                      href="/mypage/artwork"
                      className="absolute top-0 left-0 flex items-end justify-end w-full h-full bg-gray01 bg-opacity-[0.63] px-[10px] py-[2px] text-sm leading-normal text-[#999999]"
                    >
                      {myDrawingCount > myDrawing.length && (
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base leading-normal">
                          +{myDrawingCount - myDrawing.length}
                        </span>
                      )}
                      더보기
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          className="flex items-center justify-center mt-[21px] mx-auto w-[130px] h-10 border border-primary text-primary rounded-lg bg-white text-sm leading-none"
          onClick={async () => {
            await supabase.auth.signOut();

            //  로그아웃 완료 알림 후 sign-in 페이지로 이동
            alert("로그아웃이 완료 되었습니다.");
            router.push("/sign-in");
          }}
        >
          로그아웃
        </button>
      </div>

      <Navigation />
    </div>
  );
};
export default Mypage;
