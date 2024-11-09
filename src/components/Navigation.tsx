"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAVIGATION_LIST = ["/main", "/diary/write", "/library", "/mypage"];

const getNavigation = (index: string, isOn: string) => {
  const nowNavigation = NAVIGATION_LIST.findIndex((item) => item === index);
  return `/icons/navigation-${isOn}-${nowNavigation + 1}.svg`;
};

const Navigation = () => {
  const params = usePathname(); //아이콘 색 유지 위해서
  const [formData, setFormData] = useState(""); //이동
  console.log("🚀 ~ Navigation ~ formData:", formData);

  return (
    <div className="fixed bottom-[-1px] left-0 right-0">
      <ul className="flex justify-between gap-[1px] self-stretch bg-[#FDF7F4]">
        {NAVIGATION_LIST.map((navi) => {
          return (
            <Link href={navi} key={navi}>
              <li
                key={navi}
                className="flex w-[98.5px] h-[52px] pt-[14px] pr-[41.5px] pl-[37px] pb-[18px] items-center border-[1px] border-[#FDF7F4] shrink-0"
                onClick={() => setFormData(navi)} //이동
              >
                {params === navi ? ( //유지
                  <Image src={getNavigation(navi, "on")} alt={navi} width={24} height={24} />
                ) : (
                  <Image src={getNavigation(navi, "off")} alt={navi} width={24} height={24} />
                )}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Navigation;
