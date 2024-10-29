import Link from "next/link";
import React from "react";

const SearchPage = () => {
  return (
    <div className="p-6 mt-4 grid grid-rows-2 gap-4 text-center">
      <div className="flex gap-4 p-2">
        <Link href={"/main"}>
          <div className="pt-2">◀︎</div>
        </Link>
        <input type="text" className="border-2 rounded-md w-[300px] h-[40px] bg-zinc-200	p-2" />
      </div>
      <div>
        <p className="font-bold m-6">검색된 내용이 없네요.</p>
        <p className="text-sm text-gray-400">오늘은 어떤 이야기를 들려주실 건가요?</p>
      </div>
    </div>
  );
};

export default SearchPage;
