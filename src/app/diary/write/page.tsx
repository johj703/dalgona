"use client";

import Draw from "@/components/diary/Draw";
import { FormData } from "@/types/Canvas";
import { RefObject, useEffect, useRef, useState } from "react";

const POST_ID = crypto.randomUUID();
const initialData = {
  id: POST_ID,
  title: "",
  date: "",
  emotion: "",
  type: "",
  content: "",
  draw: null
};
const EMOTION_LIST = ["행복해요", "좋아요", "그냥 그래요", "별로에요", "힘들어요"];
const TYPE_LIST = ["모눈종이", "줄노트", "편지지"];

const Write = () => {
  const [goDraw, setGoDraw] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initialData);

  const textareaRef: RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [textareaRef.current?.scrollHeight]);

  const onChangeFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <>
      <form action="">
        {/* 타이틀 */}
        <input
          type="text"
          name="title"
          id="tilte"
          value={formData.title}
          onChange={(e) => onChangeFormData(e)}
          placeholder="제목 입력"
        />

        {/* 날짜 */}
        <div>
          <label htmlFor="date">날짜</label>
          <input type="text" name="date" id="date" />
        </div>

        <div>
          <span>오늘의 기분</span>
          <ul>
            {EMOTION_LIST.map((emotion) => {
              return (
                <li key={emotion} onClick={() => setFormData({ ...formData, emotion: emotion })}>
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
                <li key={type} onClick={() => setFormData({ ...formData, type: type })}>
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
            <img src={formData.draw} alt="그림" onClick={() => setGoDraw(true)} />
          )}
        </div>

        <div>
          <label htmlFor="content">글로 쓰기</label>
          <textarea
            ref={textareaRef}
            name="content"
            id="content"
            rows={1}
            value={formData.content}
            onChange={(e) => onChangeFormData(e)}
          />
        </div>
      </form>

      {/* 그림판 */}
      <div>
        {goDraw && (
          <Draw POST_ID={POST_ID} setFormData={setFormData} formData={formData} setGoDraw={setGoDraw} goDraw={goDraw} />
        )}
      </div>
    </>
  );
};
export default Write;
