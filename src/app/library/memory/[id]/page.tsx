"use client";

import CommonTitle from "@/components/CommonTitle";
import DetailComponent from "@/components/diary/DetailComponent";
import Modal from "@/components/Modal";
import Navigation from "@/components/Navigation";
import useGetDevice from "@/hooks/useGetDevice";
import { FormData } from "@/types/Canvas";
import { fetchData } from "@/utils/diary/diaryData";
import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MemoriesBox = ({ params }: { params: { id: string } }) => {
  const [postData, setPostData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openClose, setOpenClose] = useState<boolean>(false);
  const router = useRouter();
  const device = useGetDevice();

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
    router.replace("/library");
  };

  return (
    <>
      {!isLoading && (
        <>
          <CommonTitle title="추억 보관함" post_id={params.id} setOpenClose={setOpenClose} />
          {postData ? (
            <>
              <div className="border border-black rounded-lg p-4 mx-4 mt-4 bg-white">
                <p className="text-center font-bold">이 순간을 기억해 두셨군요!</p>
                <p className="text-center font-bold">그 소중한 감정이 다시 살아납니다.</p>
              </div>
              <DetailComponent postData={postData} setOpenClose={setOpenClose} />

              {/* 삭제 확인 모달 */}
              {openClose && (
                <Modal
                  mainText="이 날의 일기를 삭제 하시겠습니까?"
                  subText="삭제 후에는 복구할 수 없습니다."
                  setModalState={setOpenClose}
                  isConfirm={true}
                  confirmAction={onClickDelete}
                />
              )}
            </>
          ) : (
            <div>게시글을 불러오지 못 했습니다.</div>
          )}
          {device === "mobile" && <Navigation />}
        </>
      )}
    </>
  );
};

export default MemoriesBox;
