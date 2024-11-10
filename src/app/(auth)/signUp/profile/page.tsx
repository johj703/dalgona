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
  birthDay: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1, "일은 1일부터 시작합니다.").max(31, "일은 31일까지 가능합니다.")),
  gender: z.enum(["남성", "여성"])
});

// zod 스키마의 타입을 추론해서 ProfileData 타입을 정의
type ProfileData = z.infer<typeof profileSchema>;

export default function SaveUserProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema)
  });

  // ** signIn 된 로그인 정보 가져오기 로직 추가
  // ** 그 후 users 테이블에 한꺼번에 업데이트 하면 됨!
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  console.log(errorMessage);

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

  // 파일 이름을 안전하게 변환하는 함수
  function sanitizeFileName(fileName: string): string {
    const extension = fileName.split(".").pop(); // 파일 확장자 추출
    const sanitizedFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9]/g, "_")}`;
    return extension ? `${sanitizedFileName}.${extension}` : sanitizedFileName;
  }

  // Supabase 스토리지에 프로필 이미지 업로드 및 URL 가져오기
  async function uploadProfileImage(file: File): Promise<string | null> {
    if (!userEmail) {
      console.log("사용자 이메일을 찾을 수 없습니다.");
      return null;
    }
    const sanitizedFileName = sanitizeFileName(file.name); // 고유한 파일 이름 생성
    const filePath = `${userEmail}/${sanitizedFileName}`; // 입력한 이메일 디렉토리를 포함한 파일 경로

    const { data, error } = await supabase.storage
      .from("profile") // 스토리지 버킷 이름
      .upload(filePath, file);

    if (error) {
      console.log("프로필 이미지 업로드 오류 : ", error);
      return null;
    }

    console.log(data);
    // 이미지 URL 생성
    const { data: publicData } = supabase.storage.from("profile").getPublicUrl(filePath);

    return publicData.publicUrl || null;
  }

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(file);
    clearErrors();
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: ProfileData) => {
    if (!userEmail) {
      setErrorMessage("로그인 상태를 확인할 수 없습니다.");
      return;
    }
    try {
      // 생년월일을 조합해서 yyyy-mm-dd 형식의 문자열로 변환
      const birthday = `${data.birthYear}-${String(data.birthMonth).padStart(2, "0")}-${String(data.birthDay).padStart(
        2,
        "0"
      )}`;

      // 프로필 이미지 URL 업로드 후 URL 가져오기
      let profileImageUrl = null;
      if (profileImage) {
        profileImageUrl = await uploadProfileImage(profileImage);
      }

      // Supabase에 프로필 데이터 저장
      const { error } = await supabase
        .from("users")
        .update({
          profile_image: profileImageUrl, // 이미지 URL을 profile_image에 저장
          birthday, // yyyy-mm-dd 형태로 저장
          gender: data.gender
        })
        // 이메일로 특정 사용자 지정
        .eq("email", userEmail);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* 페이지 안내 텍스트 */}
      <h1 className="text-xl mb-6">환영해요.</h1>
      <p className="text-xl mb-6">사용하실 프로필을 작성해 주세요.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-11/12 max-w-md bg-white p-6 rounded-lg shadow-md">
        {/* 프로필 사진 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">프로필 사진</label>
          {profileImage ? (
            <Image src={URL.createObjectURL(profileImage)} alt="프로필 사진" width={100} height={100} className="rounded-full mb-2" />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-2"></div>
          )}
          <input type="file" onChange={handleImageUpload} className="w-full text-sm text-gray-500" />
        </div>

        {/* 생년월일 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
          <div className="flex gap-2">
          <select {...register("birthYear")} className="p-2 border border-gray-300 rounded-md w-full">
            <option value=""></option>
            {Array.from({ length: 124 }, (_, i) => 1900 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <p>년</p>
          <select {...register("birthMonth")} className="p-2 border border-gray-300 rounded-md w-full">
            <option value=""></option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <p>월</p>
          <select {...register("birthDay")} className="p-2 border border-gray-300 rounded-md w-full">
            <option value=""></option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <p>월</p>
          </div>
          {errors.birthYear && <p className="text-xs text-red-500 mt-1">{errors.birthYear.message}</p>}
          {errors.birthMonth && <p className="text-xs text-red-500 mt-1">{errors.birthMonth.message}</p>}
          {errors.birthDay && <p className="text-xs text-red-500 mt-1">{errors.birthDay.message}</p>}
        </div>

        {/* 성별 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" value="남성" {...register("gender")} className="mr-2" />
              남성
            </label>
            <label className="flex items-center">
              <input type="radio" value="여성" {...register("gender")} className="mr-2" />
              여성
            </label>
          </div>
          {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
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
