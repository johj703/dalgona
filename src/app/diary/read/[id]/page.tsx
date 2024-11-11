"use client";

import CommonTitle from "@/components/CommonTitle";
import DetailComponent from "@/components/diary/DetailComponent";
import Modal from "@/components/Modal";
import Navigation from "@/components/Navigation";
import TopButton from "@/components/TopButton";
import { FormData } from "@/types/Canvas";
import { fetchData } from "@/utils/diary/fetchData";
import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Read = ({ params }: { params: { id: string } }) => {
  const [postData, setPostData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openClose, setOpenClose] = useState<boolean>(false);
  const router = useRouter();
  const getData = async () => {
    const DiaryData = await fetchData(params.id);
    setPostData(DiaryData);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const onClickDelete = async () => {
    await browserClient.from("diary").delete().eq("id", params.id);
    const { error } = await browserClient.storage.from("posts").remove(["drawing/" + params.id]);
    if (error) console.error(error);

    router.replace("/main");
  };

  return (
    <>
      {!isLoading && (
        <div className="flex flex-col min-h-dvh">
          <CommonTitle title={"일기장"} post_id={params.id} setOpenClose={setOpenClose} />
          {postData ? (
            <>
              <DetailComponent postData={postData} />

              {/* 삭제 확인 모달 */}
              {openClose && (
                <Modal
                  mainText="이 날의 일기를 삭제 하시겠습니까??"
                  subText="초기화 후에는 복구할 수 없습니다."
                  setModalState={setOpenClose}
                  isConfirm={true}
                  confirmAction={onClickDelete}
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center pt-2 pb-[60px] px-4 text-lg leading-[1.35] text-gray04">
              게시글을 불러오지 못 했습니다.
            </div>
          )}
          <TopButton />
          <Navigation />
        </div>
      )}
    </>
  );
};
export default Read;
