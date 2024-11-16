"use client";
import CommonTitle from "@/components/CommonTitle";
import { CustomAlert } from "@/components/CustomAlert";
import Modal from "@/components/Modal";
import callCustomAlert from "@/lib/callCustomAlert";
import { delDrafts } from "@/lib/drafts/delDrafts";
import { fetchDrafts } from "@/lib/drafts/fetchDrafts";
import getLoginUser from "@/lib/getLoginUser";
import { Diary } from "@/types/library/Diary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Drafts = () => {
  const [drafts, setDrafts] = useState<Diary[] | null>(null);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [openClose, setOpenClose] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [customAlert, setCustomAlert] = useState<{ type: string; text: string; position: string } | null>(null);

  const router = useRouter();

  const getUserId = async () => {
    const data = await getLoginUser();
    if (data) setUserId(data.id);
  };
  const getDraft = async (user_id: string) => {
    const data = await fetchDrafts(user_id);
    if (data) setDrafts(data);
  };

  useEffect(() => {
    getUserId();
    if (userId) getDraft(userId);
  }, [userId]);

  const addCheckList = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setCheckList([...checkList, id]);
    } else {
      setCheckList(checkList.filter((listId) => listId !== id));
    }
  };

  const clickDelete = async () => {
    if (checkList.length === 0) {
      return callCustomAlert(customAlert, setCustomAlert, {
        type: "fail",
        text: "삭제 할 글을 선택해주세요.",
        position: "fixed left-1/2 -translate-x-1/2 top-[62px]"
      });
    }
    setOpenClose(true);
  };

  const deleteDraft = async () => {
    await delDrafts(checkList);
    await getDraft(userId);
  };

  const clickLoad = async () => {
    if (checkList.length === 0) {
      return callCustomAlert(customAlert, setCustomAlert, {
        type: "fail",
        text: "불러올 글을 선택해주세요.",
        position: "fixed left-1/2 -translate-x-1/2 top-[62px]"
      });
    } else if (checkList.length > 1) {
      return callCustomAlert(customAlert, setCustomAlert, {
        type: "fail",
        text: "하나의 글만 선택해주세요.",
        position: "fixed left-1/2 -translate-x-1/2 top-[62px]"
      });
    }

    router.push(`/diary/drafts/load/${checkList[0]}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <CommonTitle title={"임시저장 목록"} />

      <div className="lg:flex flex-col ">
        {drafts?.length !== 0 ? (
          <ul className="flex flex-col gap-1 px-4 lg:order-2 lg:p-4">
            {drafts?.map((draft) => {
              return (
                <li key={draft.id} className="relative flex items-center gap-[22px] py-2">
                  <input
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 peer lg:w-8 lg:h-8"
                    type="checkbox"
                    onChange={(e) => addCheckList(e, draft.id)}
                  />
                  <span className="bg-checkbox-off peer-checked:bg-checkbox-on bg-cover w-6 h-6 lg:w-8 lg:h-8"></span>
                  <div className="flex-1 py-[11px] px-4 bg-white border border-black border-solid rounded-lg lg:py-4 lg:rounded-2xl">
                    <div className="text-base leading-normal lg:text-lg">{draft.title}</div>
                    <div className="mt-1 font-Dovemayo text-xs leading-normal lg:mt-2 lg:text-base lg:text-[#737373]">
                      {draft.created_at.split("T")[0].replaceAll("-", ".")} {draft.created_at.split("T")[1].slice(0, 5)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex-1 flex items-center justify-center text-lg font-Dovemayo text-[#A6A6A6] ">
            임시저장된 내용이 없습니다
          </div>
        )}

        <span className="h-14 lg:hidden"></span>
        <div className="fixed bottom-0 left-0 flex w-full h-14 bg-background01 border-t border-[#A6A6A6] rounded-2xl overflow-hidden lg:order-1 lg:gap-6 lg:static lg:rounded-none lg:border-0 lg:border-b lg:h-auto lg:py-6 lg:px-4 lg:bg-transparent">
          <button className="draft-button" type="button" onClick={() => clickDelete()}>
            삭제
          </button>
          <button className="draft-button" onClick={() => clickLoad()}>
            불러오기
          </button>
        </div>
      </div>
      {/* 삭제 확인 모달 */}
      {openClose && (
        <Modal mainText="삭제하시겠습니까?" setModalState={setOpenClose} isConfirm={true} confirmAction={deleteDraft} />
      )}

      {/* 커스텀 알럿 */}
      {customAlert! && CustomAlert(customAlert)}
    </div>
  );
};
export default Drafts;
