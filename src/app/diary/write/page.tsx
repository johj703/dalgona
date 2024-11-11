import WritePage from "@/components/diary/WritePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "글작성 페이지",
  description: "달별로 모아보는 고즈넉한 나의 일기"
};

const Write = () => {
  return <WritePage />;
};
export default Write;
