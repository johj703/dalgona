"use client";

import Draw from "@/components/diary/Draw";
import { FormData } from "@/types/Canvas";
import browserClient from "@/utils/supabase/client";
import Calender from "@/components/diary/Calender";
import { toast } from "garlic-toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EMOTION_LIST, getEmoji } from "@/utils/diary/getEmoji";
import Image from "next/image";
import CommonTitle from "../CommonTitle";
import { TypeModal } from "./TypeModal";

const TYPE_LIST = ["모눈종이", "줄노트", "편지지"];

const Form = ({ POST_ID, initialData, isModify }: { POST_ID: string; initialData: FormData; isModify?: boolean }) => {
  const [goDraw, setGoDraw] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [openCalender, setOpenCalender] = useState<boolean>(false);
  const [openTypeModal, setOpenTypeModal] = useState<string>("");
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
        if (formData.title === "") {
          return toast.error("제목을 입력해주세요.", {
            position: "b-l",
            autoClose: true,
            autoCloseTime: 2000,
            progressBar: false
          });
        }

        const { error } = await browserClient.from("drafts").insert(formData);
        if (error) {
          toast.error("임시저장에 실패하였습니다.", {
            position: "b-l",
            autoClose: true,
            autoCloseTime: 2000,
            progressBar: false
          });
          console.error(error);
          return;
        }

        toast.success("임시 저장 되었습니다.", {
          position: "b-l",
          autoClose: true,
          autoCloseTime: 2000,
          progressBar: false
        });
      } else {
        const { error } = await browserClient.from("drafts").update(formData).eq("id", POST_ID);
        if (error) {
          toast.error("임시저장에 실패하였습니다.", {
            position: "b-l",
            autoClose: true,
            autoCloseTime: 2000,
            progressBar: false
          });
          console.error(error);
          return;
        }

        toast.success("임시 저장 되었습니다.", {
          position: "b-l",
          autoClose: true,
          autoCloseTime: 2000,
          progressBar: false
        });
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
    <div className="bg-background02 min-h-screen">
      <CommonTitle title={"일기 쓰기"} draft={true} />
      <form onSubmit={() => onSubmit()} className="flex flex-col gap-6">
        {/* 타이틀 */}
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => onChangeFormData(e)}
          placeholder="제목 입력"
          className="py-4 mx-4 text-xl leading-tight font-bold placeholder:text-[#8B8B8B] bg-transparent border-b border-[rgba(184, 179, 179, 0.40)]"
        />

        {/* 날짜 */}
        <div className="flex flex-col gap-2 mx-4 pb-4 border-b border-[rgba(184, 179, 179, 0.40)]">
          <div className="flex items-center justify-between text-base font-semibold leading-5">날짜</div>

          <div onClick={() => setOpenCalender(true)} className="flex gap-2">
            <div className="text-xl leading-tight text-[#8B8B8B]">
              <span className="text-[#1C1B1F]">{formData.date.slice(0, 4)}</span>년
            </div>
            <div className="text-xl leading-tight text-[#8B8B8B]">
              <span className="text-[#1C1B1F]">{formData.date.split("월")[0].slice(-2)}</span>월
            </div>
            <div className="text-xl leading-tight text-[#8B8B8B]">
              <span className="text-[#1C1B1F]">{formData.date.split("일")[0].slice(-2)}</span>일
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between  mx-4 text-base font-semibold leading-5">오늘의 기분</div>
          <ul className="flex gap-2 overflow-x-auto px-4 scrollbar-hide">
            {EMOTION_LIST.map((emotion) => {
              return (
                <li
                  key={emotion}
                  className={`flex flex-col items-center gap-1 w-[74px] shrink-0 text-center text-xs leading-5 ${
                    formData.emotion === emotion && "border-2 border-black"
                  }`}
                  onClick={() => setFormData({ ...formData, emotion: emotion })}
                >
                  <Image src={getEmoji(emotion)} alt={emotion} width={40} height={40} />

                  {emotion}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2  mx-4">
          <div className="flex items-center justify-between text-base font-semibold leading-5">
            일기장 속지 양식 선택
          </div>
          <ul className="flex gap-4">
            {TYPE_LIST.map((type, idx) => {
              return (
                <li key={type} className="flex-1" onClick={() => setOpenTypeModal(type)}>
                  {formData.type === type ? (
                    <img src={`/images/diary-type-on-${idx + 1}.svg`} alt={type} />
                  ) : (
                    <img src={`/images/diary-type-${idx + 1}.svg`} alt={type} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 그림판 */}
        <div ref={drawRef} className="group/draw open  flex flex-col gap-2  mx-4">
          <div className="flex items-center justify-between text-base font-semibold leading-5">
            그림 그리기{" "}
            <span onClick={() => toggleTab(drawRef)} className="group-[.open]/draw:rotate-180">
              <img src="/icons/toggle-arrow.svg" alt="아래 화살표" />
            </span>
          </div>

          {!formData.draw ? (
            <div
              className="group-[.open]/draw:block hidden text-center text-base text-[#D84E35] leading-none py-4 rounded-br-2xl rounded-bl-2xl border border-solid border-[#D84E35] bg-white"
              onClick={() => setGoDraw(true)}
            >
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
          <div ref={contentsRef} className="group/contents open flex flex-col gap-2  mx-4">
            <div className="flex items-center justify-between text-base font-semibold leading-5">
              글로 쓰기{" "}
              <span onClick={() => toggleTab(contentsRef)} className="group-[.open]/contents:rotate-180">
                <img src="/icons/toggle-arrow.svg" alt="아래 화살표" />
              </span>
            </div>
            <textarea
              ref={textareaRef}
              name="contents"
              id="contents"
              rows={9}
              value={formData.contents}
              onChange={(e) => onChangeFormData(e)}
              placeholder="이곳에 내용을 입력해주세요"
              className="resize-none outline-none w-full bg-local bg-custom-textarea leading-8 group-[.open]/contents:block hidden"
            />
          </div>
        )}

        <span className="h-14"></span>
        <div className="fixed bottom-0 left-0 flex w-full h-14 bg-[#EFE6DE] border-t border-[#A6A6A6] rounded-tr-2xl rounded-tl-2xl overflow-hidden">
          <button
            className="flex-1 text-center text-xl leading-[1.35] py-4"
            type="button"
            onClick={() => onClickDraft()}
          >
            임시저장
          </button>
          <button className="flex-1 text-center text-xl leading-[1.35] py-4">저장</button>
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

      {/* 일기장 속지 모달 */}
      {openTypeModal && (
        <TypeModal
          setFormData={setFormData}
          formData={formData}
          setOpenTypeModal={setOpenTypeModal}
          openTypeModal={openTypeModal}
        />
      )}
    </div>
  );
};
export default Form;
