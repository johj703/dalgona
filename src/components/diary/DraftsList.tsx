"use client";
import { Diary } from "@/types/library/Diary";
import browserClient from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const DraftsList = () => {
  const [drafts, setDrafts] = useState<Diary[]>([]);
  const [delList, setDelList] = useState<string[]>([]);

  const getDraft = async (user_id: string) => {
    const data = await fetchDrafts(user_id);
    if (data) setDrafts(data);
  };

  useEffect(() => {
    getDraft("32b1e26a-2968-453b-a5c4-f2b766c9bccb");
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
    await getDraft("32b1e26a-2968-453b-a5c4-f2b766c9bccb");
  };

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
export default DraftsList;

const delDrafts = async (delList: string[]) => {
  const response = await browserClient.from("drafts").delete().in("id", delList);

  return response;
};

const fetchDrafts = async (user_id: string) => {
  const { data } = await browserClient
    .from("drafts")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  return data;
};
