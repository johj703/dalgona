"use client";

import Draw from "@/components/diary/Draw";
import { FormData } from "@/types/Canvas";
import browserClient from "@/utils/supabase/client";
import Calender from "@/components/diary/Calender";
import { toast } from "garlic-toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const EMOTION_LIST = ["행복해요", "좋아요", "그냥 그래요", "별로에요", "힘들어요"];
const TYPE_LIST = ["모눈종이", "줄노트", "편지지"];

const Form = ({ POST_ID, initialData, isModify }: { POST_ID: string; initialData: FormData; isModify?: boolean }) => {
  const [goDraw, setGoDraw] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [openCalender, setOpenCalender] = useState<boolean>(false);
  const router = useRouter();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const drawRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const contentsRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
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
      if (formData.contents?.replaceAll(" ", "") === "") return toast.error("일기 내용을 작성해주세요.");
    }

    if (isModify) {
      const { error: updateError } = await browserClient.from("diary").update(formData).eq("id", POST_ID);
      if (updateError) return console.error("updateError => ", updateError);
    } else {
      const { error: insertError } = await browserClient.from("diary").insert(formData);
      if (insertError) return console.error("insertError => ", insertError);
    }

    const { error: deleteError } = await browserClient.from("drafts").delete().eq("id", POST_ID);
    if (deleteError) return console.error("deleteError => ", deleteError);

    router.replace(`/diary/read/${POST_ID}`);
  };

  // 날짜 선택시 달력 off
  useEffect(() => {
    if (openCalender) setOpenCalender(false);
  }, [formData.date]);

  // 탭 토글
  const toggleTab = (ref: RefObject<HTMLDivElement>) => {
    const currentRef = ref.current;
    if (currentRef?.classList.contains("open")) {
      currentRef?.classList.remove("open");
    } else {
      currentRef?.classList.add("open");
    }
  };

  return (
    <>
      <form action={() => onSubmit()} className="flex flex-col gap-4">
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
          <div className="flex items-center justify-between text-base font-semibold leading-5">날짜</div>
          <input
            type="text"
            name="date"
            id="date"
            value={formData.date}
            onChange={(e) => e.preventDefault()}
            onClick={() => setOpenCalender(true)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-base font-semibold leading-5">오늘의 기분</div>
          <ul className="flex gap-2 overflow-x-auto">
            {EMOTION_LIST.map((emotion) => {
              return (
                <li
                  key={emotion}
                  className={`w-[74px] shrink-0 text-center text-xs leading-5 ${
                    formData.emotion === emotion && "border-2 border-black"
                  }`}
                  onClick={() => setFormData({ ...formData, emotion: emotion })}
                >
                  {emotion}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-base font-semibold leading-5">
            일기장 속지 양식 선택
          </div>
          <ul className="flex gap-4">
            {TYPE_LIST.map((type) => {
              return (
                <li
                  key={type}
                  className={`flex-1 ${formData.type === type && "border-2 border-black"}`}
                  onClick={() => setFormData({ ...formData, type: type })}
                >
                  {type}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 그림판 */}
        <div ref={drawRef} className="group/draw open">
          <div className="flex items-center justify-between text-base font-semibold leading-5">
            그림 그리기 <span onClick={() => toggleTab(drawRef)}>V</span>
          </div>

          {!formData.draw ? (
            <div className="group-[.open]/draw:block hidden" onClick={() => setGoDraw(true)}>
              탭하여 그림그리기 페이지로 이동
            </div>
          ) : (
            <div className="group-[.open]/draw:flex hidden relative items-center justify-center w-full h-[calc((100vw-32px)*0.782)] overflow-hidden rounded-2xl border border-solid border-black">
              <div className="absolute top-4 right-4" onClick={() => setFormData({ ...formData, draw: null })}>
                삭제하기
              </div>
              <img className="" src={formData.draw} alt="그림" onClick={() => setGoDraw(true)} />
            </div>
          )}
        </div>

        {formData.type !== "편지지" && (
          <div ref={contentsRef} className="group/contents open">
            <div className="flex items-center justify-between text-base font-semibold leading-5">
              글로 쓰기 <span onClick={() => toggleTab(contentsRef)}>V</span>
            </div>
            <textarea
              ref={textareaRef}
              name="contents"
              id="contents"
              rows={9}
              value={formData.contents}
              onChange={(e) => onChangeFormData(e)}
              className="resize-none w-full bg-local bg-custom-textarea leading-8 group-[.open]/contents:block hidden"
            />
          </div>
        )}

        <div className="flex w-full">
          <button className="flex-1 text-center" type="button" onClick={() => onClickDraft()}>
            임시저장
          </button>
          <button className="flex-1 text-center">저장</button>
        </div>
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
export default Form;