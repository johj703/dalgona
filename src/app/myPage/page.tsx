"use client";
import { getMonthlyEmotion } from "@/lib/mypage/getMonthlyEmotion";
import { getMyDrawing } from "@/lib/mypage/getMyDrawing";
import { getUserData } from "@/lib/mypage/getUserData";
import { EmojiData } from "@/types/mypage/EmojiData";
import { UserData } from "@/types/mypage/UserData";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

const USER_ID = "c56a4180-65aa-42ec-a945-5fd21dec0538"; // 유저데이터 전역관리 되면 수정
const DEFAULT_IMAGE = "https://spimvuqwvknjuepojplk.supabase.co/storage/v1/object/public/profile/default_profile.svg";

const Mypage = () => {
  const [userData, setUserData] = useState<UserData>();
  const [monthlyData, setMonthlyData] = useState<EmojiData>();
  const [myDrawing, setMyDrawing] = useState<{ draw: string }[]>();

  const getData = async () => {
    const UserData = await getUserData(USER_ID);
    const MonthlyData = await getMonthlyEmotion(USER_ID);
    const MyDrawing = await getMyDrawing(USER_ID);

    setUserData(UserData);

    if (MonthlyData) setMonthlyData(MonthlyData);
    if (MyDrawing) setMyDrawing(MyDrawing);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>
        <Image
          src={userData?.profile_image ? userData.profile_image : DEFAULT_IMAGE}
          width={80}
          height={80}
          alt="프로필 이미지"
        />

        <div>
          <div>
            {userData?.name} <span>{userData?.nickname}</span>
          </div>
          <div>{userData?.email}</div>
          <div className="empty:hidden">
            {userData?.birthday && <span>{userData.birthday}</span>}
            {userData?.bloodtype && <span>{userData.bloodtype}</span>}
          </div>
        </div>

        <button>수정</button>
      </div>

      <div>
        <div>이번 달 감정 모아보기</div>

        <ul>
          <li>
            <span>{monthlyData?.happy}</span>
            행복해요
          </li>
          <li>
            <span>{monthlyData?.good}</span>
            좋아요
          </li>
          <li>
            <span>{monthlyData?.soso}</span>
            그냥 그래요
          </li>
          <li>
            <span>{monthlyData?.bad}</span>
            별로에요
          </li>
          <li>
            <span>{monthlyData?.tired}</span>
            힘들어요
          </li>
        </ul>
      </div>

      <div>
        <div>내 그림 모아보기</div>
        <Link href="/mypage/artwork"></Link>
        <ul>
          {myDrawing?.map((draw, idx) => {
            return (
              <li key={idx}>
                <img src={draw.draw} alt={`그림${idx}`} />
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <button
          className=""
          onClick={async () => {
            console.log("로그아웃");
            await supabase.auth.signOut();
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  );
};
export default Mypage;
