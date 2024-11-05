"use client";

import { format } from "date-fns";

import Form from "@/components/diary/Form";
import TopButton from "@/components/main/TopButton";

const POST_ID = crypto.randomUUID();

const Write = () => {
  const initialData = {
    id: POST_ID,
    title: "",
    date: format(new Date(), "yyyy년 MM월 dd일"),
    emotion: "",
    type: "",
    contents: "",
    draw: null
  };
  return (
    <>
      <TopButton />
      <Form POST_ID={POST_ID} initialData={initialData} />
    </>
  );
};
export default Write;
