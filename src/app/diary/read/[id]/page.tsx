"use client";

import DetailLayout from "@/components/diary/DetailLayout";
import { FormData } from "@/types/Canvas";
import { FetchData } from "@/utils/diary/FetchData";
import { useEffect, useState } from "react";

const Read = ({ params }: { params: { id: string } }) => {
  const [postData, setPostData] = useState<FormData | null>(null);
  const getData = async () => {
    const DiaryData = await FetchData(params.id);
    setPostData(DiaryData);
  };

  useEffect(() => {
    getData();
  }, []);

  return postData ? <DetailLayout postData={postData} /> : <div>게시글을 불러오지 못 했습니다.</div>;
};
export default Read;
