"use client";

import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z }  from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

// 입력 유효성 검사를 위해서 Zod 스키마 정의
type profileSchema = z.object({
  profileImage: z.string().optional(),
  birthYear: z.string().nonempty("년도를 선택해 주세요."),
  birthMonth: z.string().nonempty("월을 선택해 주세요."),
  gender: z.enum(["male", "female"], { required_error: "성별을 선택해 주세요." }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SaveUserProfilePage() {
  const { handleSubmit, control } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

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
      <div>
        <h1>안녕하세요.</h1>
        <p>사용하실 프로필을 작성해 주세요.</p>
      </div>

      {/* 프로필 사진 입력 */}
      <div>
        <label htmlFor="profileImage">프로필 사진</label>
        {/* 프로필 이미지 미리보기 */}
        {profileImagePreview ? (
          <Image src={profileImagePreview} alt="프로필 미리보기" width={100} height={100} />
        ) : (
          <div>
            <span>미리보기 없음</span>
          </div>
        )}
        <input type="file" id="profileImage" {...register("profileImage")} onChange={handleImagePreview} />
      </div>

      {/* 생년월일 입력 */}
      <div>
        <div>
          <label htmlFor="birthYear">생년</label>
          <Controller
            name="birthYear"
            control={control}
            render={({ field }) => (
              <select id="birthYear" {...field} className="">
                <option value="">년</option>
                {Array.from({ length: 43 }, (_, i) => (
                  <option key={1980 + i} value={1980 + i}>
                    {1980 + i}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div>
          <label htmlFor="birthMonth">생월</label>
          <Controller
            name="birthMonth"
            control={control}
            render={({ field }) => (
              <select id="birthMonth" {...field} className="">
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}월
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      {/* 성별 선택 */}
      <div>
        <label>
          <input type="radio" value="남성" {...register("gender")} />
          남성
        </label>
        <label>
          <input type="radio" value="여성" {...register("gender")} />
          여성
        </label>
      </div>

      {/* 건나뛰기 및 시작하기 버튼 */}
      <div>
        <button onClick={() => console.log("건너뛰기 클릭")}>건너뛰기</button>
        <button onClick={handleSubmit(onSubmit)}>시작하기</button>
      </div>
    </div>
  );
}
