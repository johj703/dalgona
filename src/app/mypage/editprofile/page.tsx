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

  return <div>page</div>;
};

export default EditProfilePage;
