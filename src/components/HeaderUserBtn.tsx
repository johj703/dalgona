"use client";

import getLoginUser from "@/lib/getLoginUser";
import { getUserData } from "@/lib/mypage/getUserData";
import { UserData } from "@/types/mypage/UserData";
import browserClient from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderUserBtn = () => {
  const [userData, setUserData] = useState<UserData>();
  const router = useRouter();

  const getData = async () => {
    const loginUser = await getLoginUser();
    const UserData = await getUserData(loginUser!.id);

    setUserData(UserData);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-6 items-center">
      {!userData ? (
        <>
          <Link
            href={"/sign-up"}
            className="flex items-center justify-center w-[98px] h-[42px] border border-primary rounded-lg text-base leading-normal text-primary bg-white"
          >
            회원가입
          </Link>
          <Link
            href={"/sign-in"}
            className="flex items-center justify-center w-[90px] h-[42px] border border-primary rounded-lg text-base leading-normal text-white bg-primary"
          >
            로그인
          </Link>
        </>
      ) : (
        <>
          <Link href="/mypage" className="flex items-center gap-[10px]">
            <span className="flex items-center justify-center w-[33px] h-[33px] rounded-full overflow-hidden">
              <Image
                src={userData?.profile_image ? userData?.profile_image : "/icons/default-profile.svg"}
                alt="프로필 이미지"
                className="min-w-full min-h-full object-cover"
                width={33}
                height={33}
              />
            </span>
            <div className="flex items-center gap-[6px] text-lg leading-normal">{userData?.nickname}님</div>
          </Link>

          <button
            className="w-[98px] h-[42px] text-lg leading-tight text-primary bg-white border-primary border rounded-lg outline-none"
            onClick={async () => {
              await browserClient.auth.signOut();

              //  로그아웃 완료 알림 후 sign-in 페이지로 이동
              alert("로그아웃이 완료 되었습니다.");
              router.push("/sign-in");
            }}
          >
            로그아웃
          </button>
        </>
      )}
    </div>
  );
};
export default HeaderUserBtn;
