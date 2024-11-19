"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabase/client";
import CommonTitle from "@/components/CommonTitle";

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
  gender: z.enum(["남성", "여성"]),
  bloodType: z.enum(["A", "B", "O", "AB"]).optional()
});

// zod 스키마의 타입을 추론해서 ProfileData 타입을 정의
type ProfileData = z.infer<typeof profileSchema>;

export default function SaveUserProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema)
  });

  // ** signIn 된 로그인 정보 가져오기 로직 추가
  // ** 그 후 users 테이블에 한꺼번에 업데이트 하면 됨!
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [selectedGender, setSelectedGender] = useState<"남성" | "여성" | null>(null);
  const [selectedBloodType, setSelectedBloodType] = useState<"A" | "B" | "O" | "AB" | null>(null);
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

    const { error } = await supabase.storage
      .from("profile") // 스토리지 버킷 이름
      .upload(filePath, file);

    if (error) {
      console.log("프로필 이미지 업로드 오류 : ", error);
      return null;
    }

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

  // 클릭시 스타일 변경 로직
  const handleGenderSelect = (gender: "남성" | "여성") => {
    setSelectedGender(gender);
    setValue("gender", gender);
    clearErrors("gender");
  };

  const handleBloodTypeSelect = (type: "A" | "B" | "O" | "AB") => {
    setSelectedBloodType(type);
    clearErrors("bloodType");
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: ProfileData) => {
    // selectedGender가 정의되어 있는 경우 data.gender에 할당
    data.gender = selectedGender || data.gender;

    // selectedBloodType이 정의되어 있는 경우 data.bloodType에 할당
    data.bloodType = selectedBloodType || data.bloodType;

    if (!userEmail) {
      setErrorMessage("로그인 상태를 확인할 수 없습니다.");
      return;
    }

    // 유효성 검사 에러 확인
    if (Object.keys(errors).length > 0) {
      console.log("유효성 검사 오류 : ", errors);
      setErrorMessage("입력한 정보를 확인해 주세요.");
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
        if (!profileImageUrl) {
          setErrorMessage("프로필 이미지 업로드 중 문제가 발생했습니다.");
          return;
        }
      }

      // Supabase에 프로필 데이터 저장
      const { error } = await supabase
        .from("users")
        .update({
          profile_image: profileImageUrl, // 이미지 URL을 profile_image에 저장
          birthday, // yyyy-mm-dd 형태로 저장
          gender: data.gender,
          bloodtype: data.bloodType // bloodType 저장
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
      router.push("/sign-up/complete");
    } catch (error) {
      console.error("네트워크 오류 또는 알 수 없는 오류 : ", error);
      setErrorMessage("알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="flex flex-col min-h-dvh max-w-sm mx-auto bg-background02 lg:max-w-screen-lg">
      <CommonTitle title="회원가입" />

      <div className="flex-1 flex flex-col px-4 pt-[18px] pb-[10px]">
        {/* 페이지 안내 텍스트 */}
        <div className="text-lg leading-[1.35] lg:hidden">
          환영해요. <br /> 사용하실 프로필을 작성해 주세요.
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col mt-4 lg:px-[268px] lg:pb-[105px]">
          {/* 프로필 사진 선택 */}
          <div className="mb-10 lg:mb-6">
            <label className="block text-sm leading-normal mb-4 lg:text-lg">프로필 사진</label>

            <div className="relative w-[100px] h-[100px] mx-auto">
              <span className="flex items-center justify-center w-full h-full rounded-full overflow-hidden">
                {profileImage ? (
                  <Image
                    src={URL.createObjectURL(profileImage)}
                    alt="프로필 사진"
                    width={100}
                    height={100}
                    className="min-w-full min-h-full object-contain"
                  />
                ) : (
                  <img
                    src="/icons/default-profile.svg"
                    alt="기본 프로필 이미지"
                    className="min-w-full min-h-full object-contain"
                  />
                )}
              </span>
              <label
                htmlFor="profileImageUpload"
                className="absolute bottom-0 right-0 p-[6px] bg-white rounded-full border-black border cursor-pointer"
              >
                <img src="/icons/camera.svg" alt="프로필 업로드" />
              </label>
              <input type="file" id="profileImageUpload" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          {/* 생년월일 입력 */}
          <div className="mb-[14px] text-left lg:mb-6">
            <label className="block text-sm leading-normal mb-[10px] lg:text-lg lg:mb-4">생년월일</label>

            <div className="flex gap-[6px] lg:gap-4">
              <span className="flex items-center gap-[2px] text-sm leading-normal lg:text-base lg:gap-[9px]">
                <select
                  {...register("birthYear")}
                  className="w-[75px] text-xs text-black leading-normal py-[9px] px-[13.5px] border border-gray03 rounded-lg outline-none appearance-none bg-[url('/icons/arrow-down.svg')] bg-no-repeat bg-[center_right_13.5px] lg:text-base lg:px-[10px] lg:py-[6px]"
                >
                  <option value="">선택</option>
                  {Array.from({ length: 124 }, (_, i) => 1900 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                년
              </span>

              <span className="flex items-center gap-[2px] text-sm leading-normal lg:text-base lg:gap-[9px]">
                <select
                  {...register("birthMonth")}
                  className="w-[75px] text-xs text-black leading-normal py-[9px] px-[13.5px] border border-gray03 rounded-lg outline-none appearance-none bg-[url('/icons/arrow-down.svg')] bg-no-repeat bg-[center_right_13.5px] lg:text-base lg:px-[10px] lg:py-[6px]"
                >
                  <option value="">선택</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                월
              </span>

              <span className="flex items-center gap-[2px] text-sm leading-normal lg:text-base lg:gap-[9px]">
                <select
                  {...register("birthDay")}
                  className="w-[75px] text-xs text-black leading-normal py-[9px] px-[13.5px] border border-gray03 rounded-lg outline-none appearance-none bg-[url('/icons/arrow-down.svg')] bg-no-repeat bg-[center_right_13.5px] lg:text-base lg:px-[10px] lg:py-[6px]"
                >
                  <option value="">선택</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                일
              </span>
            </div>
            {errors.birthYear && <p className="text-xs text-red-500 mt-1">{errors.birthYear.message}</p>}
            {errors.birthMonth && <p className="text-xs text-red-500 mt-1">{errors.birthMonth.message}</p>}
            {errors.birthDay && <p className="text-xs text-red-500 mt-1">{errors.birthDay.message}</p>}
          </div>

          {/* 성별 선택 */}
          <div className="text-left mb-4">
            <label className="block text-sm leading-normal mb-[10px] lg:text-lg lg:mb-4">성별</label>

            <div className="flex gap-[10px]">
              <button
                type="button"
                {...register("gender", { required: "성별을 선택해주세요." })}
                onClick={() => handleGenderSelect("여성")}
                className={`flex items-center gap-1 h-fit px-[18.5px] py-[6px] text-xs leading-normal rounded-2xl border border-primary lg:text-base lg:rounded-full
                    ${selectedGender === "여성" ? "bg-primary text-white" : "bg-white text-primary "}`}
              >
                <Image
                  src={selectedGender === "여성" ? "/icons/female_white.svg" : "/icons/female_red.svg"}
                  alt="여성 아이콘"
                  width={18}
                  height={18}
                />
                여성
              </button>
              <button
                type="button"
                {...register("gender", { required: "성별을 선택해주세요." })}
                onClick={() => handleGenderSelect("남성")}
                className={`flex items-center gap-1 h-fit px-[18.5px] py-[6px] text-xs leading-normal rounded-2xl border border-primary lg:text-base lg:rounded-full ${
                  selectedGender === "남성" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                <Image
                  src={selectedGender === "남성" ? "/icons/male_white.svg" : "/icons/male_red.svg"}
                  alt="남성 아이콘"
                  width={18}
                  height={18}
                />
                남성
              </button>
            </div>
            {errors.gender && <p className="text-primary text-sm mt-2">{errors.gender.message}</p>}
          </div>

          {/* 혈액형 선택 */}
          <div className="text-left">
            <label className="block text-sm leading-normal mb-[10px] lg:text-lg lg:mb-4">혈액형</label>
            <div className="flex gap-[10px]">
              {["A", "B", "O", "AB"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleBloodTypeSelect(type as "A" | "B" | "O" | "AB")}
                  className={`flex items-center justify-center w-16 h-8 text-sm leading-normal rounded-2xl border border-primary lg:text-base lg:rounded-full lg:py-4
                     ${selectedBloodType === type ? "bg-primary text-white" : "bg-white text-primary"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-[10px] text-sm leading-tight text-[#b9b9b9] lg:text-lg">
            위 항목들은 선택사항이며, 언제든지 나중에 수정할 수 있습니다.
          </p>

          {/* 에러 메세지 */}
          {/* {errorMessage && <p className="">{errorMessage}</p>} */}

          {/* 건너뛰기 및 시작하기 버튼 */}
          <div className="flex gap-4 mt-auto lg:mt-[211px]">
            <button
              type="button"
              onClick={() => router.push("/sign-up/complete")}
              className="w-1/2 py-3 bg-primary text-lg leading-normal text-white rounded-lg hover:bg-primary"
            >
              건너뛰기
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 bg-primary text-lg leading-normal text-white rounded-lg hover:bg-primary"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
