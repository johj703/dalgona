"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

const EditProfilePage = () => {
  const supabase = createClientComponentClient();
  const [userData, setUserData] = useState({ nickname: "", profilePic: "" });

  return <div>page</div>;
};

export default EditProfilePage;
