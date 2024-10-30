"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

// 입력 유효성 검사를 위해서 Zod 스키마 정의
const profileSchema = z.object({
  profileImage: z.instanceof(File).optional(),
  birthYear: z.string().min(4, "유효한 연도를 입력해 주세요"),
  birthMonth: z.string().min(1, "유효한 월을 입력해 주세요"),
  gender: z.enum(["남성", "여성"])
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SaveUserProfilePage() {
  const { handleSubmit, control } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // 프로필 저장 처리 함수
  const onSubmit = (data: ProfileFormData) => {
    console.log("프로필 데이터 : ", data);
  };

  return (
    <div>
      {/* 페이지 안내 텍스트 */}
      <div className="">
        <h1 className="">안녕하세요.</h1>
        <p className="">사용하실 프로필을 작성해 주세요.</p>
      </div>

      {/* 프로필 사진 업로드 */}
      <div className="">
        {imagePreview ? (
          <Image src={imagePreview} alt="프로필 미리보기" width={100} height={100} className="" />
        ) : (
          <div className="">
            <span>이미지 없음</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* 생년월일 입력 */}
        <div>
          <label>생년월일</label>
          <div className="">
            <Controller
              name="birthYear"
              control={control}
              render={({ field }) => (
                <select {...field} className="">
                  <option value="">년</option>
                  {[...Array(100)].map((_, i) => (
                    <option key={i} value={2023 - i}>
                      {2023 - i}
                    </option>
                  ))}
                </select>
              )}
            />
            <Controller
              name="birthMonth"
              control={control}
              render={({ field }) => (
                <select {...field} className="">
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* 성별 선택 */}
        <div>
          <label>성별</label>
          <div className="">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <>
                  <label>
                    <input {...field} type="radio" value="male" />
                    남성
                  </label>
                  <label>
                    <input {...field} type="radio" value="female" />
                    여성
                  </label>
                </>
              )}
            />
          </div>
        </div>

        {/* 건너뛰기 및 시작하기 버튼 */}
        <div className="">
          <button type="button" className="">
            건너뛰기
          </button>
          <button type="submit" className="">
            시작하기
          </button>
        </div>
      </form>
    </div>
  );
}
