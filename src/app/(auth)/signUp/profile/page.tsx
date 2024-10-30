"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "../../../../utils/supabase/client.ts";
import browserClient from "@/utils/supabase/client";

// 입력 유효성 검사를 위해서 Zod 스키마 정의
const profileSchema = z.object({
  profileImage: z.string().optional(),
  birthYear: z.string().min(1950, "년도는 1950년 이상이어야 합니다."),
  birthMonth: z.string().min(1, "월은 1월부터 시작합니다.").max(12, "월은 12월까지만 가능합니다."),
  gender: z.enum(["남성", "여성"])
});

type ProfileData = z.infer<typeof profileSchema>;

export default function SaveUserProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema)
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(file);
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: ProfileData) => {
    try {
      // Supabase에 프로필 데이터 저장
      const { data: insertData, error } = await supabase
        .from("users")
        .update({
          profile_image: profileImage ? URL.createObjectURL(profileImage) : undefined,
          birth_year: data.birthYear,
          birth_month: data.birthMonth,
          gender: data.gender
        })
        // 이메일로 특정 사용자 지정
        .ep("email", "사용자의 이메일 주소");

      // 오류 발생 시 예외 처리
      if (error) {
        console.error("데이터베이스 오류 : ", error.message);
        setErrorMessage("프로필 저장 중 문제가 발생했습니다. 다시 시도해 주세요.");
        return;
      }
      // 성공 시 다음 페이지로 이동
      router.push("/main");
    } catch (error) {
      console.error("네트워크 오류 또는 알 수 없는 오류 : ", error);
      setErrorMessage("알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div>
      {/* 페이지 안내 텍스트 */}
      <h1 className="">환영해요.</h1>
      <p className="">사용하실 프로필을 작성해 주세요.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* 프로필 사진 업로드 */}
        <div className="">
          <label className="">프로필 사진</label>
          <Image src={""} alt="프로필 사진" width={100} height={100} className="" />
          <input type="file" {...register("profileImage")} className="" />
        </div>

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
