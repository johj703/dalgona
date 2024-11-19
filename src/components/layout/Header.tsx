import Link from "next/link";
import Image from "next/image";
import HeaderNav from "./HeaderNav";
import HeaderUserBtn from "./HeaderUserBtn";

const Header = () => {
  return (
    <div className="relative flex items-center p-4 ">
      <Link href={"/main"} className="px-2 mr-[151.5px]">
        <Image src={"/icons/logo.svg"} width={124} height={35} alt="로고" />
      </Link>

      <HeaderNav />

      <HeaderUserBtn />
    </div>
  );
};
export default Header;
