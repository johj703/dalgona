"use client";

import { format } from "date-fns";

import Form from "@/components/diary/Form";

const POST_ID = crypto.randomUUID();
const initialData = {
  id: POST_ID,
  title: "",
  date: format(new Date(), "yyyy년 MM월 dd일"),
  emotion: "",
  type: "",
  contents: "",
  draw: null,
  user_id: "32b1e26a-2968-453b-a5c4-f2b766c9bccb"
};

const Write = () => {
  return (
    <>
      <Form POST_ID={POST_ID} initialData={initialData} />
    </>
  );
};
export default Write;
