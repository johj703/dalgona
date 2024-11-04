import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 height-[30px]">
      <nav className="wrapper overflow-hidden bg-gray-200 mt-6">
        <Link href={"/"}>
          <div className="text-center float-left	w-[15%] h-[30px] leading-[30px] border-2 m-2">홈</div>
        </Link>
        <Link href={"/diary/read"}>
          <div className="text-center float-left	w-[15%] h-[30px] leading-[30px] border-2 m-2">목록</div>
        </Link>
        <Link href={"/diary/write"}>
          <div className="text-center float-left	w-[15%] h-[30px] leading-[30px] border-2 m-2">글쓰기</div>
        </Link>
        <Link href={"/library"}>
          <div className="text-center float-left	w-[15%] h-[30px] leading-[30px] border-2 m-2">내서재</div>
        </Link>
        <Link href={"/myPage"}>
          <div className="text-center float-left	w-[15%] h-[30px] leading-[30px] border-2 m-2">마이</div>
        </Link>
      </nav>
    </div>
  );
};

export default Navigation;
