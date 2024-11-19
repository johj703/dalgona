import { useCheckLogin } from "@/queries/useCheckLogin";
import Link from "next/link";
import HeaderProfile from "./HeaderProfile";
import { usePathname } from "next/navigation";

const HeaderUserBtn = () => {
  const pathname = usePathname();
  console.log(pathname.includes("/sign-up"));
  const { data: loginData, isLoading, isError } = useCheckLogin();

  if (isLoading) return;
  if (isError) {
    console.error("로그인 정보를 불러오는데 실패했습니다.");
    return;
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-6 items-center">
      {!loginData ? (
        !pathname.includes("/sign-up") && (
          <>
            <Link
              href={"/sign-up"}
              className="flex items-center justify-center w-[98px] h-[42px] border border-primary rounded-lg text-base leading-normal text-primary bg-white"
            >
              회원가입
            </Link>
            <Link
              href={"/sign-in"}
              className="flex items-center justify-center w-[90px] h-[42px] border border-primary rounded-lg text-base leading-normal text-white bg-primary"
            >
              로그인
            </Link>
          </>
        )
      ) : (
        <HeaderProfile userId={loginData!.id} />
      )}
    </div>
  );
};
export default HeaderUserBtn;
