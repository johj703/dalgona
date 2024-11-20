"use client";

import Form from "@/components/diary/Form";
import TopButton from "@/components/TopButton";
import useGetDevice from "@/hooks/useGetDevice";
import { useGetDiaryDetail } from "@/queries/diary/useGetDiaryDetail";

const Modify = ({ params }: { params: { id: string } }) => {
  const device = useGetDevice();
  const POST_ID = params.id;
  const { data: diary, isLoading, isError } = useGetDiaryDetail(params.id);

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center text-center pt-2 pb-[60px] px-4 text-lg leading-[1.35] text-gray04">
        일기를 불러오고있습니다.
      </div>
    );

  if (isError)
    return (
      <div className="flex-1 flex items-center justify-center text-center pt-2 pb-[60px] px-4 text-lg leading-[1.35] text-gray04">
        일기를 불러오지 못 했습니다.
      </div>
    );

  return (
    <>
      {device === "mobile" && <TopButton />}
      <Form POST_ID={POST_ID} initialData={diary![0]} isModify={true} />
    </>
  );
};
export default Modify;
