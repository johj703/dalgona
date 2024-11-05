import Link from "next/link";
import { useRouter } from "next/navigation";

type TitleProps = {
  title: string;
  post_id?: string;
};

const CommonTitle = ({ title, post_id }: TitleProps) => {
  const router = useRouter();
  return (
    <div className="relative flex items-center justify-center py-[14px]">
      <div
        className="absolute top-1/2 -translate-y-1/2 left-[10px] flex items-center justify-center w-[34px] h-[34px]"
        onClick={() => router.back()}
      >
        <img src="/icons/arrow-left.svg" alt="Arrow Left" />
      </div>

      <h2 className="text-base font-bold">{title}</h2>

      {post_id && (
        <Link
          href={`/diary/modify/${post_id}`}
          className="absolute top-1/2 -translate-y-1/2 right-[10px] text-base font-bold"
        >
          편집
        </Link>
      )}
    </div>
  );
};
export default CommonTitle;
