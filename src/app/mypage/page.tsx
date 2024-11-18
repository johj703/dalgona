"use client";
import { supabase } from "@/utils/supabase/supabase";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import CommonTitle from "@/components/CommonTitle";
import useGetDevice from "@/hooks/useGetDevice";
import Header from "@/components/layout/Header";
import { useCheckLogin } from "@/queries/useCheckLogin";
import ProfileInfo from "@/components/mypage/ProfileInfo";
import MonthlyEmotion from "@/components/mypage/MonthlyEmotion";
import MyDrawing from "@/components/mypage/MyDrawing";

const Mypage = () => {
  const device = useGetDevice();
  const router = useRouter();
  const { data: loginData, isLoading, isError } = useCheckLogin();

  if (isError) return <div>유저 정보를 불러오는데 실패했습니다.</div>;
  if (isLoading) return;

  return (
    <div className="lg:pb-[34px]">
      {device === "pc" ? <Header /> : <CommonTitle title={"마이 페이지"} />}
      <div className="py-6 lg:py-0 lg:flex flex-col gap-4">
        <ProfileInfo userId={loginData!.id} />
        <MonthlyEmotion userId={loginData!.id} />
        <MyDrawing userId={loginData!.id} />

        <button
          className="flex items-center justify-center mt-[21px] mx-auto w-[130px] h-10 border border-primary text-primary rounded-lg bg-white text-sm leading-none lg:hidden"
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

      {device === "mobile" && <Navigation />}
    </div>
  );
};
export default Mypage;
