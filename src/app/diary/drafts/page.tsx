"use client";
import CommonTitle from "@/components/CommonTitle";
import Modal from "@/components/Modal";
import { delDrafts } from "@/lib/drafts/delDrafts";
import { fetchDrafts } from "@/lib/drafts/fetchDrafts";
import { Diary } from "@/types/library/Diary";
import { toast } from "garlic-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const USER_ID = "32b1e26a-2968-453b-a5c4-f2b766c9bccb";

const Drafts = () => {
  const [drafts, setDrafts] = useState<Diary[] | null>(null);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [openClose, setOpenClose] = useState<boolean>(false);

  const router = useRouter();

  const getDraft = async (user_id: string) => {
    const data = await fetchDrafts(user_id);
    if (data) setDrafts(data);
  };

  useEffect(() => {
    getDraft(USER_ID);
  }, []);

  const addCheckList = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setCheckList([...checkList, id]);
    } else {
      setCheckList(checkList.filter((listId) => listId !== id));
    }
  };

  const clickDelete = async () => {
    if (checkList.length === 0) {
      return toast.alert("불러올 글을 선택해주세요.");
    }
    setOpenClose(true);
  };

  const deleteDraft = async () => {
    await delDrafts(checkList);
    await getDraft(USER_ID);
  };

  const clickLoad = async () => {
    if (checkList.length === 0) {
      return toast.alert("불러올 글을 선택해주세요.");
    } else if (checkList.length > 1) {
      return toast.alert("하나의 글만 선택해주세요.");
    }

    router.push(`/diary/drafts/load/${checkList[0]}`);
  };

  if (!drafts) return <div>임시저장된 내용이 없습니다</div>;

  return (
    <>
      <CommonTitle title={"임시저장 목록"} />
      <ul className="px-4">
        {drafts?.map((draft) => {
          return (
            <li key={draft.id} className="flex items-center gap-[22px] py-2">
              <input className="w-6" type="checkbox" onChange={(e) => addCheckList(e, draft.id)} />
              <div className="flex-1 py-[11px] px-4 bg-white border border-black border-solid rounded-lg">
                <div>{draft.title}</div>
                <div className="mt-1">
                  {draft.created_at.split("T")[0]} / {draft.created_at.split("T")[1].slice(0, 8)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <span className="h-14"></span>
      <div className="fixed bottom-0 left-0 flex w-full h-14 bg-[#FDF7F4] border-t border-[#A6A6A6]">
        <button className="flex-1 text-center text-[18px] py-4" type="button" onClick={() => clickDelete()}>
          삭제
        </button>
        <button className="flex-1 text-center text-[18px] py-4" onClick={() => clickLoad()}>
          불러오기
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      {openClose && (
        <Modal mainText="삭제하시겠습니까?" setModalState={setOpenClose} isConfirm={true} confirmAction={deleteDraft} />
      )}
    </>
  );
};
export default Drafts;
