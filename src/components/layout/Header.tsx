import Image from "next/image";
import lteImg from "../../../public/images/lte.png";

const Header = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeString = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

  console.log("🚀 ~ Header ~ timeString:", timeString);
  return (
    <div className="flex h-[44px] ml-[30px] mr-[22px] justify-between">
      <div className="font-bold text-[18px] h-[44px] left-[35px] pt-[15px] px-[10px] pb-[7.5px]">{timeString}</div>
      <div>
        <Image src={lteImg} width={80} height={26} alt="let" className="pt-[13px]" />
      </div>
    </div>
  );
};

export default Header;
