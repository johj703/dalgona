"use client";

import Image from "next/image";
import { useState } from "react";

export default function SaveUserProfilePage() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [gender, setGender] = useState("");

  // 프로필 이미지 변경 시 미리보기 URL 설정
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  // 프로필 저장 처리 함수
  const handleSaveProfile = () => {
    console.log("프로필 저장 : ", { profileImage, birthYear, birthMonth, gender });
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
        <input type="file" id="profileImage" accept="image/*" onChange={handleProfileImageChange} />
      </div>

      {/* 생년월일 입력 */}
      <div>
        <div>
          <label>생년</label>
          <select id="birthYear" value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
            <option>년</option>
            {Array.from({ length: 43 }, (_, i) => (
              <option key={1980 + i} value={1980 + i}>
                {1980 + i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="birthMonth">생월</label>
          <select id="birthMonth" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
            <option value="">월</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}월
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 성별 선택 */}
      <div>
        <label>
          <input
            type="radio"
            name="gender"
            value="남성"
            checked={gender === "남성"}
            onChange={(e) => setGender(e.target.value)}
          />
          남성
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="여성"
            checked={gender === "여성"}
            onChange={(e) => setGender(e.target.value)}
          />
          여성
        </label>
      </div>

      {/* 건나뛰기 및 시작하기 버튼 */}
      <div>
        <button onClick={() => console.log("건너뛰기 클릭")}>건너뛰기</button>
        <button onClick={handleSaveProfile}>시작하기</button>
      </div>
    </div>
  );
}
