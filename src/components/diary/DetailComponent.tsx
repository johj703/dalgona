import { FormData } from "@/types/Canvas";
import { GraphPaper } from "./GraphPaper";
import { getEmoji } from "@/utils/diary/getEmoji";
import { ChangeDateForm } from "./ChangeDateForm";

const DetailComponent = ({ postData }: { postData: FormData }) => {
  return (
    <div className="mt-[35px] px-[13px]">
      <div className="flex items-center justify-center gap-6">
        {postData.date && (
          <div className="flex flex-col items-center justify-center gap-2 w-[136px] h-[130px]">
            {ChangeDateForm(postData.date)}
          </div>
        )}
        <span className="w-[1px] h-[57px] bg-[#c8c8c8]"></span>
        <div className="flex flex-col items-center justify-center gap-1 w-[136px] h-[130px] text-base leading-5">
          오늘의 기분은
          <img src={getEmoji(postData.emotion, "on")} alt={postData.emotion} className="w-10 h-10 mt-1" />
          {postData.emotion}
        </div>
      </div>

      <div className="border border-black rounded-tr-lg rounded-tl-lg overflow-hidden">
        <div className="py-[14.5px] text-2xl leading-tight text-center text-black bg-[#FCA697] border-b border-black">
          {postData.title}
        </div>
        {postData.draw && <img src={postData.draw} alt={postData.title} className="bg-white w-full" />}
      </div>

      {postData.type !== "편지지" && postData.type === "모눈종이" ? (
        postData.contents && (
          <div className="flex flex-wrap font-Dovemayo text-[30px] mt-4 mb-[26px]">{GraphPaper(postData.contents)}</div>
        )
      ) : (
        <div className="bg-detail-content text-2xl leading-loose my-[26px] font-Dovemayo">{postData.contents}</div>
      )}
    </div>
  );
};
export default DetailComponent;
