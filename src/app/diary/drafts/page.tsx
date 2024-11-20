"use client";
import CommonTitle from "@/components/CommonTitle";
import DraftList from "@/components/diary/DraftList";
import { useCheckLogin } from "@/queries/useCheckLogin";

const Drafts = () => {
  const { data: loginData, isLoading, isError } = useCheckLogin();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <CommonTitle title={"임시저장 목록"} />
        <div className="flex-1 flex items-center justify-center text-lg font-Dovemayo text-[#A6A6A6] ">
          임시저장된 일기를 불러오고있습니다.
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col min-h-screen">
        <CommonTitle title={"임시저장 목록"} />
        <div className="flex-1 flex items-center justify-center text-lg font-Dovemayo text-[#A6A6A6] ">
          임시저장된 일기를 불러오는데 실패하였습니다.
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <CommonTitle title={"임시저장 목록"} />
      <DraftList userId={loginData!.id} />
    </div>
  );
};
export default Drafts;
