"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  setTimeout(() => {
    router.replace("/main");
  }, 2000);

  return (
    <div className="flex flex-col items-center justify-center gap-[14px] w-full h-dvh p-[10px] text-center">
      <p className="text-base leading-normal">“달별로 모아보는 고즈넉한 나의 일기”</p>
      <img src="/icons/logo.svg" alt="달고나 로고" />
    </div>
  );
}
