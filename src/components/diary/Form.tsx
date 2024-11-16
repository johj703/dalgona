"use client";

import Draw from "@/components/diary/Draw";
import { FormData } from "@/types/Canvas";
import browserClient from "@/utils/supabase/client";
import Calender from "@/components/diary/Calender";
import { RefObject, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { EMOTION_LIST, getEmoji } from "@/utils/diary/getEmoji";
import Image from "next/image";
import CommonTitle from "../CommonTitle";
import { TypeModal } from "./TypeModal";
import { CustomAlert } from "../CustomAlert";
import getLoginUser from "@/lib/getLoginUser";
import { iconOnOff } from "@/utils/diary/iconOnOff";
import callCustomAlert from "@/lib/callCustomAlert";
import useGetDevice from "@/hooks/useGetDevice";
import Link from "next/link";
import Header from "../layout/Header";

const TYPE_LIST = ["모눈종이", "줄노트", "편지지"];

const Form = ({ POST_ID, initialData, isModify }: { POST_ID: string; initialData: FormData; isModify?: boolean }) => {
  const [goDraw, setGoDraw] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [openCalender, setOpenCalender] = useState<boolean>(false);
  const [openTypeModal, setOpenTypeModal] = useState<string>("");
  const [customAlert, setCustomAlert] = useState<{ type: string; text: string; position: string } | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [draftLength, setDraftLength] = useState<number>(0);
  const device = useGetDevice();

  const getUserId = async () => {
    const data = await getLoginUser();
    if (data) {
      setUserId(data.id);
      getDraftsLength(data.id);
    }
  };
  const router = useRouter();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const drawRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  const contentsRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const textareaRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);

  const getDraftsLength = async (userId: string) => {
    const { data: getById, error: byIdError } = await browserClient.from("drafts").select("id").eq("user_id", userId);
    if (!byIdError) setDraftLength(getById.length);
  };

  useEffect(() => {
    // 로그인 한 유저 아이디 저장
    getUserId();

    // 날짜 선택시 달력 off
    if (openCalender) setOpenCalender(false);
  }, []);

  // 임시 저장
  const uploadToDrafts = async () => {
    const { data, error } = await browserClient.from("drafts").select("id").eq("id", POST_ID);
    if (error) {
      console.error(error);
      return;
    }

    try {
      if (formData.title === "") {
        callCustomAlert(customAlert, setCustomAlert, {
          type: "fail",
          text: "제목을 입력해주세요.",
          position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
        });

        return false;
      }

      if (data.length === 0) {
        const { error } = await browserClient.from("drafts").insert(formData);
        if (error) {
          callCustomAlert(customAlert, setCustomAlert, {
            type: "fail",
            text: "임시 저장에 실패했습니다.",
            position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
          });
          console.error(error);
          return;
        }

        callCustomAlert(customAlert, setCustomAlert, {
          type: "success",
          text: "임시 저장 되었습니다.",
          position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
        });
      } else {
        const { error } = await browserClient.from("drafts").update(formData).eq("id", POST_ID);
        if (error) {
          callCustomAlert(customAlert, setCustomAlert, {
            type: "fail",
            text: "임시 저장에 실패했습니다.",
            position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
          });
          console.error(error);
          return;
        }

        callCustomAlert(customAlert, setCustomAlert, {
          type: "success",
          text: "임시 저장 되었습니다.",
          position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
        });
      }
    } catch (error) {
      console.error(error);
    }

    await getDraftsLength(userId);
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
      }, 3000);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [formData.contents]);

  const onClickDraft = async () => {
    await uploadToDrafts();

    callCustomAlert(customAlert, setCustomAlert, {
      type: "success",
      text: "임시 저장 되었습니다.",
      position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
    });
    // router.replace("/main");
  };

  // 일기 내용 : contents
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && device === "mobile") {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [textareaRef.current?.value]);

  // input 값 변경 이벤트
  const onChangeFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === "title" && value.length > 20) return false;
    setFormData({ ...formData, [id]: value });
  };

  // 기록하기
  const onSubmit = async () => {
    if (formData.title === "")
      return callCustomAlert(customAlert, setCustomAlert, {
        type: "fail",
        text: "제목을 입력해주세요.",
        position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
      });

    if (formData.emotion === "")
      return callCustomAlert(customAlert, setCustomAlert, {
        type: "fail",
        text: "오늘의 감정을 선택해주세요.",
        position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
      });

    if (formData.type === "")
      return callCustomAlert(customAlert, setCustomAlert, {
        type: "fail",
        text: "일기장 속지 양식을 선택해주세요.",
        position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
      });

    if (formData.contents?.replaceAll(" ", "") === "")
      return callCustomAlert(customAlert, setCustomAlert, {
        type: "fail",
        text: "일기 내용을 작성해주세요.",
        position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
      });

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
    <div className={`bg-background02 min-h-screen ${goDraw && "h-screen overflow-hidden"}`}>
      {device === "pc" ? <Header /> : <CommonTitle title={"일기 쓰기"} draft={true} draftLength={draftLength} />}

      {/* 작성 폼 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-6 pb-14 lg:flex-row lg:flex-wrap lg:gap-4"
      >
        <div className="lg:order-2 lg:w-1/2 lg:flex-1 lg:p-4 lg:flex flex-col gap-6">
          {/* 타이틀 */}
          <div className="flex flex-col gap-2 mx-4 lg:mx-0">
            <label htmlFor="title" className="hidden lg:block text-xl leading-none">
              제목
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={(e) => onChangeFormData(e)}
              placeholder="제목 입력"
              className="outline-none py-4 text-xl leading-tight placeholder:text-[#8B8B8B] bg-transparent border-b border-[rgba(184, 179, 179, 0.40)]"
            />

            <span
              className={`text-sm leading-tight ${formData.title.length >= 20 ? "text-[#FD5B5B]" : "text-[#A6A6A6]"}`}
            >
              제목은 공백 포함 20자까지 작성 가능합니다. ({formData.title.length}/20자)
            </span>
          </div>

          {/* 날짜 */}
          <div className="flex flex-col gap-2 mx-4 pb-4 border-b border-[rgba(184, 179, 179, 0.40)] lg:mx-0">
            <div className="text-base leading-5 lg:text-xl">날짜</div>

            <div onClick={() => setOpenCalender(true)} className="flex gap-2 cursor-pointer">
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
            <div className="mx-4 text-base leading-5 lg:mx-0 lg:text-xl">오늘의 기분</div>
            <ul
              className={`flex gap-2 overflow-x-auto px-4 lg:flex-wrap lg:px-0 lg:w-80 ${
                device === "mobile" && "scrollbar-hide"
              }`}
            >
              {EMOTION_LIST.map((emotion) => {
                return (
                  <li
                    key={emotion}
                    className="flex flex-col items-center gap-1 w-[74px] shrink-0 text-center font-Dovemayo text-xs leading-5 cursor-pointer lg:text-sm"
                    onClick={() => setFormData({ ...formData, emotion: emotion })}
                  >
                    {formData.emotion === emotion ? (
                      <Image
                        src={getEmoji(emotion, "on")}
                        alt={emotion}
                        width={40}
                        height={40}
                        className="lg:w-[50px] lg:h-[50px]"
                      />
                    ) : (
                      <Image
                        src={getEmoji(emotion, "off")}
                        alt={emotion}
                        width={40}
                        height={40}
                        className="lg:w-[50px] lg:h-[50px]"
                      />
                    )}

                    {emotion}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-2  mx-4 lg:mx-0">
            <div className="text-base leading-5 lg:text-xl">일기장 속지 양식 선택</div>
            <ul className="flex gap-4">
              {TYPE_LIST.map((type, idx) => {
                return (
                  <li
                    key={type}
                    className="flex-1 max-w-[108px] cursor-pointer"
                    onClick={() => {
                      if (idx === 2) {
                        callCustomAlert(customAlert, setCustomAlert, {
                          type: "letter",
                          text: "앞으로 업데이트 될 속지입니다",
                          position: "fixed left-1/2 -translate-x-1/2 bottom-[62px]"
                        });
                      } else {
                        setOpenTypeModal(type);
                      }
                    }}
                  >
                    {formData.type === type ? (
                      <img src={iconOnOff(`diary-type-${idx + 1}`, "on")} alt={type} className="w-full" />
                    ) : (
                      <img src={iconOnOff(`diary-type-${idx + 1}`, "off")} alt={type} className="w-full" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 그림판 */}
          <div ref={drawRef} className="group/draw open  flex flex-col gap-2  mx-4 lg:mx-0">
            <div className="flex items-center justify-between text-base leading-5 lg:text-xl">
              그림 그리기{" "}
              <span onClick={() => toggleTab(drawRef)} className="group-[.open]/draw:rotate-180 cursor-pointer">
                <img src="/icons/toggle-arrow.svg" alt="아래 화살표" />
              </span>
            </div>

            {!formData.draw ? (
              <div
                className="group-[.open]/draw:block hidden text-center text-base text-primary leading-none py-4 rounded-br-2xl rounded-bl-2xl border border-solid border-primary bg-white cursor-pointer lg:text-xl lg:py-[14px]"
                onClick={() => setGoDraw(true)}
              >
                탭하여 그림그리기 페이지로 이동
              </div>
            ) : (
              <div className="group-[.open]/draw:flex hidden relative items-center justify-center w-full h-[calc((100vw-32px)*0.782)] overflow-hidden rounded-2xl border border-solid border-black bg-white">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="flex items-center justify-center w-[84px] h-[35px] text-sm border border-gray04 rounded-lg bg-white"
                    onClick={() => setGoDraw(true)}
                  >
                    수정하기
                  </button>
                  <button
                    className="flex items-center justify-center w-[84px] h-[35px] text-sm border border-gray04 rounded-xl"
                    onClick={() => setFormData({ ...formData, draw: null })}
                  >
                    삭제하기
                  </button>
                </div>
                <img className="" src={formData.draw} alt="그림" />
              </div>
            )}
          </div>
        </div>

        <div
          ref={contentsRef}
          className="group/contents open flex flex-col gap-2  mx-4 lg:w-1/2 lg:order-3 lg:m-0 lg:flex-1"
        >
          <div className="flex items-center justify-between text-base leading-5 lg:text-xl">
            글로 쓰기{" "}
            <span
              onClick={() => toggleTab(contentsRef)}
              className="group-[.open]/contents:rotate-180 cursor-pointer lg:hidden"
            >
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
            className="resize-none outline-none w-full bg-local bg-custom-textarea leading-8 group-[.open]/contents:block hidden font-Dovemayo lg:!block lg:h-full lg:px-4 lg:text-2xl lg:leading-[52px] lg:bg-custom-textarea-lg"
          />
        </div>

        <span className="h-14 lg:hidden"></span>
        <div className="fixed bottom-0 left-0 flex items-center w-full h-14 bg-background01 border-t border-[#A6A6A6] rounded-tr-2xl rounded-tl-2xl overflow-hidden lg:order-1 lg:gap-6 lg:static lg:rounded-none lg:border-0 lg:border-b lg:h-auto lg:py-6 lg:px-4 lg:bg-transparent">
          <button className="write-form-button" type="button" onClick={() => onClickDraft()}>
            임시저장
          </button>
          <button className="write-form-button">기록하기</button>
          {device === "pc" && (
            <Link href={`/diary/drafts`} className="text-xl leading-[1.35] ml-auto">
              불러오기({draftLength})
            </Link>
          )}
        </div>
      </form>

      {/* 그림판 */}
      {goDraw && (
        <Draw POST_ID={POST_ID} setFormData={setFormData} formData={formData} setGoDraw={setGoDraw} goDraw={goDraw} />
      )}

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

      {/* 커스텀 알럿 */}
      {customAlert! && CustomAlert(customAlert)}
    </div>
  );
};
export default Form;
