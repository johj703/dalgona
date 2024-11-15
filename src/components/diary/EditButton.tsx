import { booleanState } from "@/types/Canvas";
import Link from "next/link";

type EditButtonProps = {
  post_id?: string;
  setOpenClose?: booleanState;
};

const EditButton = ({ post_id, setOpenClose }: EditButtonProps) => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-[22px] flex gap-[22px] lg:top-0 lg:-translate-y-0 lg:right-0 lg:p-4 lg:gap-3">
      <Link href={`/diary/modify/${post_id}`}>
        <img src="/icons/edit.svg" alt="편집" className="lg:w-8 lg:h-8" />
      </Link>

      <button onClick={() => setOpenClose && setOpenClose(true)}>
        <img src="/icons/delete.svg" alt="삭제" className="lg:w-8 lg:h-8" />
      </button>
    </div>
  );
};
export default EditButton;
