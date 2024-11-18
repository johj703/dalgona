import { useGetUserData } from "@/queries/useGetUserData";
import { useLogoutMutation } from "@/queries/useLogoutMutation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HeaderProfile = ({ userId }: { userId: string }) => {
  const { data: userData, isLoading } = useGetUserData(userId);
  const { mutate: logout } = useLogoutMutation();
  const router = useRouter();

  if (isLoading) return <></>;
  return (
    <>
      <Link href="/mypage" className="flex items-center gap-[10px]">
        <span className="flex items-center justify-center w-[33px] h-[33px] rounded-full overflow-hidden">
          <Image
            src={userData?.profile_image ? userData?.profile_image : "/icons/default-profile.svg"}
            alt="프로필 이미지"
            className="min-w-full min-h-full object-cover"
            width={33}
            height={33}
          />
        </span>
        <div className="flex items-center gap-[6px] text-lg leading-normal">{userData?.nickname}님</div>
      </Link>

      <button
        className="w-[98px] h-[42px] text-lg leading-tight text-primary bg-white border-primary border rounded-lg outline-none"
        onClick={async () => {
          logout();

          //  로그아웃 완료 알림 후 sign-in 페이지로 이동
          router.push("/sign-in");
        }}
      >
        로그아웃
      </button>
    </>
  );
};
export default HeaderProfile;
