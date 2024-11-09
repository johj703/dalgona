import { booleanState } from "@/types/Canvas";
import Link from "next/link";
import { useRouter } from "next/navigation";

type TitleProps = {
  title: string;
  post_id?: string;
  draft?: boolean;
  draftLength?: number;
  setOpenClose?: booleanState;
};

const CommonTitle = ({ title, post_id, draft, draftLength, setOpenClose }: TitleProps) => {
  const router = useRouter();
  return (
    <div className="relative flex items-center justify-center h-[52px]">
      <div
        className="absolute top-1/2 -translate-y-1/2 left-[8.5px] flex items-center justify-center w-[34px] h-[34px]"
        onClick={() => router.back()}
      >
        <img src="/icons/back.svg" alt="뒤로가기" />
      </div>

      <h2 className="text-[18px] leading-normal">{title}</h2>

      {post_id && (
        <div className="absolute top-1/2 -translate-y-1/2 right-[22px] flex gap-[22px]">
          <Link href={`/diary/modify/${post_id}`}>
            <img src="/icons/edit.svg" alt="편집" />
          </Link>

          <button onClick={() => setOpenClose && setOpenClose(true)}>
            <img src="/icons/delete.svg" alt="삭제" />
          </button>
        </div>
      )}

      {draft && (
        <Link
          href={`/diary/drafts`}
          className="absolute top-1/2 -translate-y-1/2 right-[10px] text-[18px] leading-normal"
        >
          보관({draftLength})
        </Link>
      )}
    </div>
  );
};
export default CommonTitle;
