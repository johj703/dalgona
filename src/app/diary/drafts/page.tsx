"use client";
import { delDrafts } from "@/lib/drafts/delDrafts";
import { fetchDrafts } from "@/lib/drafts/fetchDrafts";
import { Diary } from "@/types/library/Diary";
import { useEffect, useState } from "react";

const USER_ID = "32b1e26a-2968-453b-a5c4-f2b766c9bccb";

const Drafts = () => {
  const [drafts, setDrafts] = useState<Diary[] | null>(null);
  const [delList, setDelList] = useState<string[]>([]);

  const getDraft = async (user_id: string) => {
    const data = await fetchDrafts(user_id);
    if (data) setDrafts(data);
  };

  useEffect(() => {
    getDraft(USER_ID);
  }, []);

  const addDelList = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setDelList([...delList, id]);
    } else {
      setDelList(delList.filter((listId) => listId !== id));
    }
  };

  const clickDelete = async () => {
    await delDrafts(delList);
    await getDraft(USER_ID);
  };
  if (!drafts) return <div>임시저장된 내용이 없습니다</div>;
  return (
    <>
      <ul>
        {drafts?.map((draft) => {
          return (
            <li key={draft.id}>
              <input type="checkbox" onChange={(e) => addDelList(e, draft.id)} />
              <div>
                <div>{draft.title}</div>
                <div>
                  {draft.created_at.split("T")[0]} / {draft.created_at.split("T")[1].slice(0, 8)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div>
        <button onClick={() => clickDelete()}>삭제하기</button>
        <button>불러오기</button>
      </div>
    </>
  );
};
export default Drafts;
