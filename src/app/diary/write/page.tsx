"use client";

import { format } from "date-fns";

import Form from "@/components/diary/Form";
import TopButton from "@/components/main/TopButton";
import { useEffect } from "react";
// import { useRouter } from "next/navigation";
import getLoginUser from "@/lib/getLoginUser";
import browserClient from "@/utils/supabase/client";

const POST_ID = crypto.randomUUID();
const initialData = {
  id: POST_ID,
  title: "",
  date: format(new Date(), "yyyy년 MM월 dd일"),
  emotion: "",
  type: "",
  contents: "",
  draw: null
};

const Write = () => {
  const today = format(new Date(), "yyyy년 MM월 dd일");
  // const router = useRouter();

  const getUserId = async () => {
    const data = await getLoginUser();
    if (!data) return false;

    const { count, error } = await browserClient
      .from("diary")
      .select("*", { count: "exact" })
      .match({ user_id: data.id, date: today });

    if (error) return console.error(error);

    if (count !== 0) {
      // alert("이미 오늘 일기를 작성하셨습니다");
      // return router.push("/main");
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  return (
    <>
      <TopButton />
      <Form POST_ID={POST_ID} initialData={initialData} />
    </>
  );
};
export default Write;
