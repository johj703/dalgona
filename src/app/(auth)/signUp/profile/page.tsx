"use client";

import { useState } from "react";

export default function saveUserProfilePage() {
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

  return <div>page</div>;
}
