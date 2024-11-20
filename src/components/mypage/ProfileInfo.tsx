"use client";
import { useGetUserData } from "@/queries/useGetUserData";
import getGenderIcon from "@/utils/mypage/getGenderIcon";
import Image from "next/image";
import { useRouter } from "next/navigation";
const DEFAULT_IMAGE = "https://spimvuqwvknjuepojplk.supabase.co/storage/v1/object/public/profile/default_profile.svg";

const ProfileInfo = ({ userId }: { userId: string }) => {
  const { data: userData, isLoading } = useGetUserData(userId);
  const router = useRouter();
  if (isLoading) return;
  return (
    <div className="flex gap-[14px] px-4 lg:flex-col lg:items-center lg:text-center lg:gap-3 lg:p-4">
      <span className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full overflow-hidden lg:mb-1">
        <Image
          src={userData?.profile_image ? userData.profile_image : DEFAULT_IMAGE}
          width={80}
          height={80}
          alt="프로필 이미지"
          className="min-w-full min-h-full object-cover"
        />
      </span>

      <div className="flex-1 flex flex-col gap-[7px] lg:gap-2">
        <div className="flex items-center gap-[7px] text-lg leading-tight lg:gap-2 lg:justify-center">
          {userData?.name} <span className="text-[#7D7D7D]">{userData?.nickname}</span>
        </div>
        <div className="text-sm leading-tight text-[#AEAEAE] lg:text-base">{userData?.email}</div>
        <div className="flex items-center gap-[10px] p-[2px] font-Dovemayo text-sm leading-normal empty:hidden lg:gap-4 lg:text-base">
          {userData?.birthday && <span>{userData.birthday.replaceAll("-", ".")}</span>}
          {userData?.gender && <img src={getGenderIcon(userData.gender)} alt={userData.gender} />}
          {userData?.bloodtype && <span>{userData.bloodtype}형</span>}
        </div>
      </div>

      <button className="mb-auto flex items-center gap-2" onClick={() => router.push("/mypage/editprofile")}>
        <span className="hidden text-xl leading-tight text-[#7D7D7D] lg:block">수정하기</span>
        <img src="/icons/setting.svg" alt="마이페이지 수정" />
      </button>
    </div>
  );
};
export default ProfileInfo;
