import Link from "next/link";

const NAV_List = [
  {
    text: "홈",
    href: "/main"
  },
  {
    text: "내 일기 검색",
    href: "/main/search"
  },
  {
    text: "일기 쓰기",
    href: "/diary/write"
  },
  {
    text: "기록의 방",
    href: "/library"
  }
];
const HeaderNav = () => {
  return (
    <div className="flex gap-10">
      {NAV_List.map((nav) => {
        return (
          <Link key={`header${nav.href}`} href={nav.href} className="text-lg leading-tight">
            {nav.text}
          </Link>
        );
      })}
    </div>
  );
};
export default HeaderNav;
