"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditProfilePage = () => {
  const supabase = createClientComponentClient();
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const router = useRouter();
  const DEFAULT_IMAGE = "/icons/default-profile.png";

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
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("users").update({
        nickname,
        profile_image: profileImage,
        birthday,
        gender,
        bloodtype: bloodType
      });

      if (error) {
        alert("프로필 업데이트에 실패했습니다.");
      } else {
        alert("프로필이 업데이트가 완료되었습니다.");
        router.push("/mypage"); // 수정 후 mypage로 이동
      }
    }
  };

  return (
    <div>
      <h2>내 정보 수정</h2>
      <div>
        <Image src={profileImage} alt="프로필 이미지" width={80} height={80} />
        <button onClick={() => setProfileImage("/path/to/new/image.png")}>프로필 사진 변경</button>
      </div>

      <div>
        <label>닉네임</label>
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      </div>

      <div>
        <label>생일</label>
        <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
      </div>

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

      <div>
        <label>혈액형</label>
        <div>
          {["A", "B", "O", "AB"].map((type) => (
            <button
              key={type}
              className={`blood-type-button ${bloodType === type ? "selected" : ""}`}
              onClick={() => setBloodType(type)}
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
