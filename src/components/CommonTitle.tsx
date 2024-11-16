import { booleanState } from "@/types/Canvas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderUserBtn from "./HeaderUserBtn";
import useGetDevice from "@/hooks/useGetDevice";
import EditButton from "./diary/EditButton";

type TitleProps = {
  title: string;
  post_id?: string;
  draft?: boolean;
  draftLength?: number;
  setOpenClose?: booleanState;
  setGoDraw?: booleanState;
};

const CommonTitle = ({ title, post_id, draft, draftLength, setOpenClose, setGoDraw }: TitleProps) => {
  const router = useRouter();
  const device = useGetDevice();

  return (
    <div className="relative flex items-center justify-center h-[52px] lg:h-[74px] lg:border-b lg:border-gray04">
      <div
        className="absolute top-1/2 -translate-y-1/2 left-[8.5px] lg:left-4 flex items-center justify-center w-[34px] h-[34px] lg:w-[42px] lg:h-[42px] cursor-pointer"
        onClick={() => (!setGoDraw ? router.back() : setGoDraw(false))}
      >
        <img src="/icons/back.svg" alt="뒤로가기" className="w-full h-full" />
      </div>

      <h2 className="text-[18px] leading-normal">{title}</h2>

      {device === "pc" ? (
        <HeaderUserBtn />
      ) : (
        <>
          {post_id && <EditButton post_id={post_id} setOpenClose={setOpenClose} />}
          {draft && (
            <Link
              href={`/diary/drafts`}
              className="absolute top-1/2 -translate-y-1/2 right-[10px] text-[18px] leading-normal"
            >
              불러오기({draftLength})
            </Link>
          )}
        </>
      )}
    </div>
  );
};
export default CommonTitle;
