import Link from "next/link";
import HeaderUserBtn from "./HeaderUserBtn";
import Image from "next/image";
import HeaderNav from "./HeaderNav";

const Header = () => {
  return (
    <div className="relative flex items-center p-4 border-b border-gray04">
      <Link href={"/main"} className="px-2">
        <Image src={"/icons/logo.svg"} width={124} height={35} alt="로고" />
      </Link>

      <HeaderNav />

      <HeaderUserBtn />
    </div>
  );
};
export default Header;
