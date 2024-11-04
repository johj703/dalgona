"use client";

import Draw from "@/components/diary/Draw";
import { FormData } from "@/types/Canvas";
import browserClient from "@/utils/supabase/client";
import Calender from "@/utils/diary/Calender";
import { format } from "date-fns";
import { toast } from "garlic-toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
const EMOTION_LIST = ["행복해요", "좋아요", "그냥 그래요", "별로에요", "힘들어요"];
const TYPE_LIST = ["모눈종이", "줄노트", "편지지"];

const Write = () => {
  const [goDraw, setGoDraw] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [openCalender, setOpenCalender] = useState<boolean>(false);

  const router = useRouter();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const textareaRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

  // 임시 저장
  const uploadToDrafts = async () => {
    const { data, error } = await browserClient.from("drafts").select("id").eq("id", POST_ID);
    if (error) {
      console.error(error);
      return;
    }

    try {
      if (data.length === 0) {
        const { error } = await browserClient.from("drafts").insert(formData);
        if (error) {
          toast.error("임시저장에 실패하였습니다.");
          console.error(error);
          return;
        }

        toast.success("임시 저장 되었습니다.");
      } else {
        const { error } = await browserClient.from("drafts").update(formData).eq("id", POST_ID);
        if (error) {
          toast.error("임시저장에 실패하였습니다.");
          console.error(error);
          return;
        }

        toast.success("임시 저장 되었습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!isDraft) return;

    uploadToDrafts();
    setIsDraft(false);
  }, [isDraft]);

  useEffect(() => {
    if (formData.contents) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        setIsDraft(true);
      }, 1000);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [formData.contents]);

  const onClickDraft = async () => {
    await uploadToDrafts();
    router.replace("/main");
  };

  // 일기 내용 : contents
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [textareaRef.current?.value]);

  // input 값 변경 이벤트
  const onChangeFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // 기록하기
  const onSubmit = async () => {
    if (formData.title === "") return toast.error("제목을 입력해주세요.");
    if (formData.emotion === "") return toast.error("오늘의 감정을 선택해주세요.");
    if (formData.type === "") return toast.error("일기장 속지 양식을 선택해주세요.");
    if (formData.type === "편지지") {
      if (!formData.draw) return toast.error("그림을 그려주세요.");
    } else {
      if (formData.contents === "") return toast.error("일기 내용을 작성해주세요.");
    }

    const { error: insertError } = await browserClient.from("diary").insert(formData);
    if (insertError) return console.error("insertError => ", insertError);

    const { error: deleteError } = await browserClient.from("drafts").delete().eq("id", POST_ID);
    if (deleteError) return console.error("deleteError => ", deleteError);

    router.replace(`/diary/read/${POST_ID}`);
  };

  // 날짜 선택시 달력 off
  useEffect(() => {
    if (openCalender) setOpenCalender(false);
  }, [formData.date]);

  return (
    <>
      <form action={() => onSubmit()}>
        {/* 타이틀 */}
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => onChangeFormData(e)}
          placeholder="제목 입력"
        />

        {/* 날짜 */}
        <div>
          <label htmlFor="date">날짜</label>
          <input
            type="text"
            name="date"
            id="date"
            value={formData.date}
            onChange={(e) => e.preventDefault()}
            onClick={() => setOpenCalender(true)}
          />
        </div>

        <div>
          <span>오늘의 기분</span>
          <ul>
            {EMOTION_LIST.map((emotion) => {
              return (
                <li
                  key={emotion}
                  className={`${formData.emotion === emotion && "border-2 border-black"}`}
                  onClick={() => setFormData({ ...formData, emotion: emotion })}
                >
                  {emotion}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <span>일기장 속지 양식 선택</span>
          <ul>
            {TYPE_LIST.map((type) => {
              return (
                <li
                  key={type}
                  className={`${formData.type === type && "border-2 border-black"}`}
                  onClick={() => setFormData({ ...formData, type: type })}
                >
                  {type}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 그림판 */}
        <div>
          {!formData.draw ? (
            <div onClick={() => setGoDraw(true)}>탭하여 그림그리기 페이지로 이동</div>
          ) : (
            <>
              <div onClick={() => setFormData({ ...formData, draw: null })}>삭제하기</div>
              <img src={formData.draw} alt="그림" onClick={() => setGoDraw(true)} />
            </>
          )}
        </div>

        {formData.type !== "편지지" && (
          <div>
            <div>글 내용</div>
            <textarea
              ref={textareaRef}
              name="contents"
              id="contents"
              rows={1}
              value={formData.contents}
              onChange={(e) => onChangeFormData(e)}
              className="resize-none"
            />
          </div>
        )}

        <button type="button" onClick={() => onClickDraft()}>
          임시저장
        </button>
        <button>저장</button>
      </form>

      {/* 그림판 */}
      <div>
        {goDraw && (
          <Draw POST_ID={POST_ID} setFormData={setFormData} formData={formData} setGoDraw={setGoDraw} goDraw={goDraw} />
        )}
      </div>

      {/* 달력 */}
      {openCalender && <Calender setFormData={setFormData} formData={formData} setOpenCalender={setOpenCalender} />}
    </>
  );
};
export default Write;
