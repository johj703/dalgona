"use client";

import { useCheckLogin } from "@/queries/useCheckLogin";
import Link from "next/link";
import HeaderProfile from "./HeaderProfile";

const HeaderUserBtn = () => {
  const { data: loginData, isLoading, isError } = useCheckLogin();

  if (isLoading) return;
  if (isError) return console.error("로그인 정보를 불러오는데 실패했습니다.");

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-6 items-center">
      {!loginData ? (
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
        <HeaderProfile userId={loginData!.id} />
      )}
    </div>
  );
};
export default HeaderUserBtn;
