"use client";

import CommonTitle from "@/components/CommonTitle";
import ReadContainer from "@/components/diary/ReadContainer";
import Navigation from "@/components/Navigation";
import useGetDevice from "@/hooks/useGetDevice";
import { useState } from "react";
import Header from "@/components/layout/Header";

const MemoriesBox = ({ params }: { params: { id: string } }) => {
  const [openClose, setOpenClose] = useState<boolean>(false);
  const device = useGetDevice();

  return (
    <>
      {device === "pc" ? <Header /> : <CommonTitle title={"추억 보관함"} />}

      <div>
        <div className="border border-black rounded-lg p-4 mx-4 my-4 bg-white lg:mb-6">
          <p className="text-center font-bold">이 순간을 기억해 두셨군요!</p>
          <p className="text-center font-bold">그 소중한 감정이 다시 살아납니다.</p>
        </div>

        <ReadContainer diaryId={params.id} openClose={openClose} setOpenClose={setOpenClose} />
      </div>
      {device === "mobile" && <Navigation />}
    </>
  );
};

export default MemoriesBox;
