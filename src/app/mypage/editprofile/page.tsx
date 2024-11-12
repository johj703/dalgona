"use client";

import browserClient from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditProfilePage = () => {
  const supabase = browserClient;
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const DEFAULT_IMAGE = "https://spimvuqwvknjuepojplk.supabase.co/storage/v1/object/public/profile/default_profile.svg";

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
          setBirthday(profileData.birthday || "");
          setGender(profileData.gender || "");
          setBloodType(profileData.bloodtype || "");
          console.log("Profile Data: ", profileData); // 데이터 확인
        }
      }
      console.log("User Data", user);
    };
    fetchUserData();
  }, []);

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
        const { error } = await supabase.storage.from("profile_image").upload(fileName, file);

        if (error) {
          alert("프로필 이미지 업로드에 실패했습니다.");
          console.log(error);
          return;
        }

        // 업로드가 성공하면 파일의 공개 URL을 얻어 프로필 이미지 URL로 설정
        uploadedImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${fileName}`;
      }

      const { error } = await supabase.from("users").update({
        nickname,
        profile_image: uploadedImageUrl,
        birthday,
        gender,
        bloodtype: bloodType
      });

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
    <div>
      <h2>내 정보 수정</h2>

      {/* 프로필 이미지와 변경 버튼 */}
      <div>
        <Image src={profileImage} alt="프로필 이미지" width={80} height={80} />

        {/* 프로필 사진 변경 버튼 */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange} // 파일 선택시 상태 업데이트
          className="mt-2"
        />
      </div>

      {/* 닉네임 입력 필드 */}
      <div>
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)} // 입력값 변경시 상태 업데이트
        />
      </div>

      {/* 생일 입력 필드 */}
      <div>
        <label>생년월일</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)} // 입력값 변경시 상태 업데이트
        />
      </div>

      {/* 성별 선택 버튼 */}
      <div>
        <label>성별</label>
        <div>
          <button className={`gender-button ${gender === "male" ? "selected" : ""}`} onClick={() => setGender("male")}>
            남성
          </button>
          <button
            className={`gender-button ${gender === "female" ? "selected" : ""}`}
            onClick={() => setGender("female")}
          >
            여성
          </button>
        </div>
      </div>

      {/* 혈액형 선택 버튼 */}
      <div>
        <label>혈액형</label>
        <div>
          {["A", "B", "O", "AB"].map((type) => (
            <button
              key={type}
              className={`blood-type-button ${bloodType === type ? "selected" : ""}`}
              onClick={() => setBloodType(type)} // 선택된 혈액형을 설정
            >
              {type}형
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default EditProfilePage;
