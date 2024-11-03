import { FormData } from "@/types/Canvas";
import { GraphPaper } from "./GraphPaper";
import { getEmoji } from "@/utils/diary/getEmoji";
import { ChangeDateForm } from "./ChangeDateForm";

const DetailComponent = ({ postData }: { postData: FormData }) => {
  return (
    <div>
      <div>
        {postData.date && <div>{ChangeDateForm(postData.date)}</div>}
        <div>
          <span>오늘의 기분은</span>
          {getEmoji(postData.emotion)}
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
