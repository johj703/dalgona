import { booleanState } from "@/types/Canvas";
import Link from "next/link";

type EditButtonProps = {
  post_id?: string;
  setOpenClose?: booleanState;
};

const EditButton = ({ post_id, setOpenClose }: EditButtonProps) => {
  return (
    <>
      <Link href={`/diary/modify/${post_id}`}>
        <img src="/icons/edit.svg" alt="편집" className="lg:w-8 lg:h-8" />
      </Link>

      <button onClick={() => setOpenClose && setOpenClose(true)}>
        <img src="/icons/delete.svg" alt="삭제" className="lg:w-8 lg:h-8" />
      </button>
    </>
  );
};
export default EditButton;
