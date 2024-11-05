import { FormData } from "@/types/Canvas";
import { GraphPaper } from "./GraphPaper";
import { getEmoji } from "@/utils/diary/getEmoji";
import { ChangeDateForm } from "./ChangeDateForm";

const DetailComponent = ({ postData }: { postData: FormData }) => {
  return (
    <div>
      <div className="flex items-center gap-6">
        {postData.date && (
          <div className="flex flex-col justify-center gap-2 font-bold leading-none">
            {ChangeDateForm(postData.date)}
          </div>
        )}
        <div>
          <span>오늘의 기분은</span>
          <img src={getEmoji(postData.emotion)} alt={postData.emotion} />
          {postData.emotion}
        </div>
      </div>

      <div>
        <div>{postData.title}</div>
        {postData.draw && <img src={postData.draw} alt={postData.title} />}

        {postData.type !== "편지지" && postData.type === "모눈종이" ? (
          postData.contents && <div className="flex flex-wrap">{GraphPaper(postData.contents)}</div>
        ) : (
          <div>{postData.contents}</div>
        )}
      </div>
    </div>
  );
};
export default DetailComponent;
