"use client";

import CommonTitle from "@/components/CommonTitle";
import ReadContainer from "@/components/diary/ReadContainer";
import Navigation from "@/components/Navigation";
import TopButton from "@/components/TopButton";
import useGetDevice from "@/hooks/useGetDevice";

import { useState } from "react";

const Read = ({ params }: { params: { id: string } }) => {
  const [openClose, setOpenClose] = useState<boolean>(false);
  const device = useGetDevice();

  return (
    <div className="flex flex-col min-h-dvh">
      <CommonTitle title={"일기장"} post_id={params.id} setOpenClose={setOpenClose} />

      <div className="mt-[34px] lg:mt-8">
        <ReadContainer diaryId={params.id} openClose={openClose} setOpenClose={setOpenClose} />
      </div>

      {device === "mobile" && (
        <>
          <TopButton />
          <Navigation />
        </>
      )}
    </div>
  );
};
export default Read;
