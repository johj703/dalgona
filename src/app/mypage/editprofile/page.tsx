"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditProfilePage = () => {
  const supabase = createClientComponentClient();
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const router = useRouter();
  const DEFAULT_IMAGE = "/icons/default-profile.png";

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        setNickname(user.nickname || "");
        setProfileImage(user.profile_image || DEFAULT_IMAGE);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        nickname,
        profile_image: profileImage
      })
      .eq("id", user.id);

    if (error) {
      alert("프로필 업데이트에 실패했습니다.");
    } else {
      alert("프로필이 업데이트가 완료되었습니다.");
      router.push("/mypage"); // 수정 후 mypage로 이동
    }
  };

  return <div>page</div>;
};

export default EditProfilePage;
