import { useGetDiaryDetail } from "@/queries/diary/useGetDiaryDetail";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import DetailComponent from "./DetailComponent";
import { booleanState } from "@/types/Canvas";
import { useDeleteDiaryMutation } from "@/queries/diary/useDiaryMutation";
import useGetDevice from "@/hooks/useGetDevice";

type ReadContainerProps = {
  diaryId: string;
  openClose: boolean;
  setOpenClose: booleanState;
};

const ReadContainer = ({ diaryId, openClose, setOpenClose }: ReadContainerProps) => {
  const { data: diary, isLoading, isError } = useGetDiaryDetail(diaryId);
  const { mutate: deleteDiary } = useDeleteDiaryMutation();
  const device = useGetDevice();
  const router = useRouter();

  const onClickDelete = async () => {
    deleteDiary(diaryId);

    router.replace("/main");
  };

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
      {diary!.length !== 0 ? (
        <>
          <DetailComponent postData={diary![0]} setOpenClose={setOpenClose} device={device} />

          {/* 삭제 확인 모달 */}
          {openClose && (
            <Modal
              mainText="이 날의 일기를 삭제 하시겠습니까??"
              subText="초기화 후에는 복구할 수 없습니다."
              setModalState={setOpenClose}
              isConfirm={true}
              confirmAction={onClickDelete}
            />
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center pt-2 pb-[60px] px-4 text-lg leading-[1.35] text-gray04">
          일기를 불러오지 못 했습니다.
        </div>
      )}
    </>
  );
};
export default ReadContainer;
