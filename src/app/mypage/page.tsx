"use client";
import browserClient from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

type UserData = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  profile_image?: string;
  gender?: string;
  birthday?: string;
  nickname: string;
  main_diary?: string;
  bloodtype?: string;
};

const USER_ID = "c56a4180-65aa-42ec-a945-5fd21dec0538";
const DEFAULT_IMAGE = "https://spimvuqwvknjuepojplk.supabase.co/storage/v1/object/public/profile/default_profile.svg";

type EmojiData = {
  happy: number;
  good: number;
  soso: number;
  bad: number;
  tired: number;
};

const Mypage = () => {
  const [userData, setUserData] = useState<UserData>();
  const [monthlyData, setMonthlyData] = useState<EmojiData>();
  const [myDrawing, setMyDrawing] = useState<{ draw: string }[]>();
  const getData = async () => {
    const UserData = await GetUserData(USER_ID);
    const MonthlyData = await GetMonthlyEmotion(USER_ID);
    const MyDrawing = await GetMyDrawing(USER_ID);
    setUserData(UserData);
    if (MonthlyData) setMonthlyData(MonthlyData);
    if (MyDrawing) setMyDrawing(MyDrawing);
  };
  useEffect(() => {
    getData();
  }, []);
  console.log(myDrawing);
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
    </>
  );
};
export default Mypage;

const GetUserData = async (user_id: string) => {
  try {
    const { data, error } = await browserClient.from("users").select("*").eq("id", user_id);

    if (error) {
      console.error("유저정보 불러오기 실패 => ", error);
      return <div>유저정보를 불러오는데 실패하였습니다.</div>;
    }

    return data[0];
  } catch (error) {
    console.error("FetchData Error => ", error);
  }
};

const GetMonthlyEmotion = async (user_id: string) => {
  try {
    const result = await browserClient
      .from("diary")
      .select("emotion")
      .eq("user_id", user_id)
      .textSearch("date", `2024년&10월`);

    if (result.data) {
      const monthlyData = result.data;
      const emotionData = {
        happy: monthlyData?.filter((emotion) => emotion.emotion === "기쁨").length, //기쁨 텍스트 수정 필요
        good: monthlyData?.filter((emotion) => emotion.emotion === "좋아요").length,
        soso: monthlyData?.filter((emotion) => emotion.emotion === "그냥 그래요").length,
        bad: monthlyData?.filter((emotion) => emotion.emotion === "별로에요").length,
        tired: monthlyData?.filter((emotion) => emotion.emotion === "힘들어요").length
      };

      return emotionData;
    }
  } catch (error) {
    console.error("Emotion Load Error => ", error);
  }
};

const GetMyDrawing = async (user_id: string) => {
  try {
    const { data } = await browserClient
      .from("diary")
      .select("*")
      .eq("user_id", user_id)
      .neq("draw", null)
      .order("created_at", { ascending: false })
      .range(0, 2);

    return data;
  } catch (error) {
    console.error("Drawing Load Error => ", error);
  }
};
