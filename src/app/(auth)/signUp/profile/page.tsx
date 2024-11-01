"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase/client";

// 입력 유효성 검사를 위해서 Zod 스키마 정의
const profileSchema = z.object({
  profileImage: z.string().optional(),
  birthYear: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1950, "년도는 1950년 이상이어야 합니다.")),
  birthMonth: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1, "월은 1월부터 시작합니다.").max(12, "월은 12월까지만 가능합니다.")),
  gender: z.enum(["남성", "여성"])
});

type ProfileData = z.infer<typeof profileSchema>;

export default function SaveUserProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema)
  });
  const values = watch();

  // ** signIn 된 로그인 정보 가져오기 로직 추가
  // ** 그 후 users 테이블에 한꺼번에 업데이트 하면 됨!
  console.log(values);
  const [userEmail, setUserEmail];
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // 로그인한 사용자 이메일 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session?.user.email) setUserEmail(session.user.email);
    };
    fetchUser();
  }, []);

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) setProfileImage(file);
    clearErrors();
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: ProfileData) => {
    if (!userEmail) {
      setErrorMessage("로그인 상태를 확인할 수 없습니다.");
      return;
    }
    console.log(data);
    try {
      // Supabase에 프로필 데이터 저장
      const { error } = await supabase
        .from("users")
        .update({
          profile_image: profileImage ? URL.createObjectURL(profileImage) : undefined,
          birth_year: data.birthYear,
          birth_month: data.birthMonth,
          gender: data.gender
        })
        // 이메일로 특정 사용자 지정
        .eq("email", "사용자의 이메일 주소");

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
        {/* 프로필 사진 */}
        <div className="">
          <label className="">프로필 사진</label>
          {profileImage ? (
            <Image src={URL.createObjectURL(profileImage)} alt="프로필 사진" width={100} height={100} className="" />
          ) : (
            <div className=""></div>
          )}
          <input type="file" onChange={handleImageUpload} className="" />
        </div>

        {/* 생년월일 입력 */}
        <div>
          <label>생년월일</label>
          <select {...register("birthYear")} className="">
            <option value="">년</option>
            {Array.from({ length: 124 }, (_, i) => 1900 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select {...register("birthMonth")} className="">
            <option value="">월</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {errors.birthYear && <p className="">{errors.birthYear.message}</p>}
          {errors.birthMonth && <p className="">{errors.birthMonth.message}</p>}
        </div>

        {/* 성별 선택 */}
        <div className="">
          <label className="">성별</label>
          <div className="">
            <label>
              <input type="radio" value="남성" {...register("gender")} className="" />
              남성
            </label>
            <label>
              <input type="radio" value="여성" {...register("gender")} className="" />
              여성
            </label>
          </div>
          {errors.gender && <p className="">{errors.gender.message}</p>}
        </div>

        {/* 에러 메세지 */}
        {/* {errorMessage && <p className="">{errorMessage}</p>} */}

        {/* 건너뛰기 및 시작하기 버튼 */}
        <div className="">
          <button type="button" onClick={() => router.push("/main")} className="">
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
