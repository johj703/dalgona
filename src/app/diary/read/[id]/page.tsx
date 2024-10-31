"use client";

import DetailLayout from "@/components/diary/DetailLayout";
import { FormData } from "@/types/Canvas";
import { FetchData } from "@/utils/diary/FetchData";
import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Read = ({ params }: { params: { id: string } }) => {
  const [postData, setPostData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const getData = async () => {
    const DiaryData = await FetchData(params.id);
    setPostData(DiaryData);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const onClickModify = () => {
    router.replace(`/diary/modify/${params.id}`);
  };

  const onClickDelete = async () => {
    await browserClient.from("diary").delete().eq("id", params.id);

    router.replace("/main");
  };

  return (
    !isLoading &&
    (postData ? (
      <>
        <DetailLayout postData={postData} />
        <div>
          <button onClick={() => onClickModify()}>수정</button>
          <button onClick={() => onClickDelete()}>삭제</button>
        </div>
      </>
    ) : (
      <div>게시글을 불러오지 못 했습니다.</div>
    ))
  );
};
export default Read;
