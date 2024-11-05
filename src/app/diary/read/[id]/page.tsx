"use client";

import CommonTitle from "@/components/CommonTitle";
import DetailComponent from "@/components/diary/DetailComponent";
import { FormData } from "@/types/Canvas";
import { fetchData } from "@/utils/diary/fetchData";
import browserClient from "@/utils/supabase/client";
import { toast } from "garlic-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Read = ({ params }: { params: { id: string } }) => {
  const [postData, setPostData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    toast
      .confirm("정말 삭제하시겠습니까?", {
        confirmBtn: "확인",
        cancleBtn: "취소",
        confirmBtnColor: "#0000ff",
        cancleBtnColor: "#ff0000"
      })
      .then(async (isConfirm) => {
        if (isConfirm) {
          await browserClient.from("diary").delete().eq("id", params.id);

          router.replace("/main");
        }
      });
  };

  return (
    !isLoading &&
    (postData ? (
      <>
        <CommonTitle title={"일기 쓰기"} post_id={params.id} />
        <DetailComponent postData={postData} />
        <div>
          <button onClick={() => onClickDelete()}>삭제</button>
        </div>
      </>
    ) : (
      <div>게시글을 불러오지 못 했습니다.</div>
    ))
  );
};
export default Read;
