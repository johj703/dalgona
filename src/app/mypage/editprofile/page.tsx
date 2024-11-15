"use client";

import browserClient from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditProfilePage = () => {
  const supabase = browserClient;
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [selectedGender, setSelectedGender] = useState<"여성" | "남성" | "">("");
  const [selectedBloodType, setSelectedBloodType] = useState<"A" | "B" | "O" | "AB" | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]); // 동적으로 일 수 목록
  const router = useRouter();
  const DEFAULT_IMAGE = "https://spimvuqwvknjuepojplk.supabase.co/storage/v1/object/public/profile/default_profile.svg";

  // 사용자 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        // users 테이블에서 추가 정보를 가져오는 부분
        const { data: profileData, error } = await supabase
          .from("users")
          .select("nickname, profile_image, birthday, gender, bloodtype")
          .eq("id", user.id)
          .single(); // 한 명의 사용자만 가져옴.

        if (error) {
          console.log("프로필 데이터를 가져오는데 실패했습니다.", error);
        }

        if (profileData) {
          setNickname(profileData.nickname || "");
          setProfileImage(profileData.profile_image || DEFAULT_IMAGE);

          const [year, month, day] = profileData.birthday ? profileData.birthday.split("-") : ["", "", ""];
          setBirthYear(year);
          setBirthMonth(month);
          setBirthDay(day);

          setSelectedGender(profileData.gender || "");
          setSelectedBloodType(profileData.bloodtype || "");
        }
      }
    };
    fetchUserData();
  }, []);

  // 생일 연도와 월에 따른 일 수를 계산하는 useEffect
  useEffect(() => {
    const calculateDaysInMonth = () => {
      const year = parseInt(birthYear, 10);
      const month = parseInt(birthMonth, 10);

      if (!isNaN(year) && !isNaN(month)) {
        const days = new Date(year, month, 0).getDate(); // 해당 연도와 월의 일 수 계산
        setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
      }
    };
    if (birthYear && birthMonth) {
      calculateDaysInMonth();
    }
  }, [birthYear, birthMonth]);

  // 성별 선택 함수
  const handleGenderSelect = (gender: "여성" | "남성") => {
    setSelectedGender(gender);
  };

  // 혈액형 선택 함수
  const handleBloodTypeSelect = (bloodType: "A" | "B" | "O" | "AB") => {
    setSelectedBloodType(bloodType);
  };

  // 프로필 저장 함수
  const handleSave = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      // 만약 파일이 선택되었으면 업로드
      let uploadedImageUrl = profileImage;

      if (file) {
        // 새로운 프로필 이미지를 supabase 스토리지에 업로드
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from("profile").upload(fileName, file);

        if (error) {
          alert("프로필 이미지 업로드에 실패했습니다.");
          console.log(error);
          return;
        }

        // 업로드가 성공하면 파일의 공개 URL을 얻어 프로필 이미지 URL로 설정
        uploadedImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${fileName}`;
      }

      const { error } = await supabase
        .from("users")
        .update({
          nickname,
          profile_image: uploadedImageUrl,
          birthday: `${birthYear}-${birthMonth}-${birthDay}`,
          gender: selectedGender,
          bloodtype: selectedBloodType
        })
        .eq("id", user.id);

      if (error) {
        alert("프로필 업데이트에 실패했습니다.");
      } else {
        alert("프로필이 업데이트 되었습니다.");
        router.push("/mypage"); // 수정 후 mypage로 이동
      }
    }
  };

  // 파일 선택시 상태 업데이트
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFile(file); // 파일 상태 업데이트
      setProfileImage(URL.createObjectURL(file)); // 파일을 미리보기 이미지로 설정
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 lg:text-3xl">내 정보 수정</h2>

      {/* 프로필 이미지와 변경 버튼 */}
      <div className="flex flex-col items-center mb-4">
        <Image
          src={profileImage}
          alt="프로필 이미지"
          width={80}
          height={80}
          className="rounded-full border border-gray-300 object-cover"
        />

        {/* 프로필 사진 변경 버튼 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange} // 파일 선택시 상태 업데이트
          className="mt-4 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
        />
      </div>

      {/* 닉네임 입력 필드 */}
      <div className="w-full max-w-xs mb-4">
        <label className="block text-sm font-medium text-gray-700">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)} // 입력값 변경시 상태 업데이트
          className="input w-full border rounded-md p-2 mt-1"
        />
      </div>

      {/* 생일 입력 필드 */}
      <div className="w-full max-w-xs mb-4">
        <label className="block text-sm font-medium text-gray-700">생년월일</label>

        <div className="flex items-center gap-2 mt-1">
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="input border rounded-md p-2"
          >
            <option>연도</option>
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <span className="text-sm">년</span>

          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="input border rounded-md p-2"
          >
            <option>월</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={String(month).padStart(2, "0")}>
                {month}
              </option>
            ))}
          </select>
          <span className="text-sm">월</span>

          <select
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            className="input border rounded-md p-2"
          >
            <option>일</option>
            {daysInMonth.map((day) => (
              <option key={day} value={String(day).padStart(2, "0")}>
                {day}
              </option>
            ))}
          </select>
          <span className="text-sm">일</span>
        </div>
      </div>

      {/* 성별 선택 버튼 */}
      <div className="w-full max-w-xs mb-4">
        <label className="block text-sm leading-normal mb-[10px]">성별</label>
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={() => handleGenderSelect("여성")}
            className={`flex items-center gap-1 h-fit px-[18.5px] py-[6px] text-xs leading-normal rounded-2xl border border-primary ${
              selectedGender === "여성" ? "bg-primary text-white" : "bg-white text-primary"
            }`}
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
            onClick={() => handleGenderSelect("남성")}
            className={`flex items-center gap-1 h-fit px-[18.5px] py-[6px] text-xs leading-normal rounded-2xl border border-primary ${
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
      </div>

      {/* 혈액형 선택 버튼 */}
      <div className="w-full max-w-xs mb-4">
        <label className="block text-sm leading-normal mb-[10px]">혈액형</label>
        <div className="flex gap-[10px]">
          {["A", "B", "O", "AB"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleBloodTypeSelect(type as "A" | "B" | "O" | "AB")}
              className={`flex items-center justify-center w-16 h-8 text-sm leading-normal rounded-2xl border border-primary ${
                selectedBloodType === type ? "bg-primary text-white" : "bg-white text-primary"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <button onClick={handleSave} className="bg-primary hover:bg-primary-300 text-white py-2 px-4 rounded-md mt-6">
        저장하기
      </button>
    </div>
  );
};

export default EditProfilePage;
