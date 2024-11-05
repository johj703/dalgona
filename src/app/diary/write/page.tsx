"use client";

import { format } from "date-fns";

import Form from "@/components/diary/Form";
import { useEffect, useState } from "react";
import getLoginUser from "@/lib/getLoginUser";

const POST_ID = crypto.randomUUID();

const Write = () => {
  const [userId, setUserId] = useState<string>("");

  const getUserId = async () => {
    const data = await getLoginUser();
    if (data) setUserId(data.id);
  };
  useEffect(() => {
    getUserId();
  }, []);

  const initialData = {
    id: POST_ID,
    title: "",
    date: format(new Date(), "yyyy년 MM월 dd일"),
    emotion: "",
    type: "",
    contents: "",
    draw: null,
    user_id: userId
  };
  return (
    <>
      <Form POST_ID={POST_ID} initialData={initialData} />
    </>
  );
};
export default Write;
