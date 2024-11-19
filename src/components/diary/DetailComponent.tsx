import { booleanState, FormData } from "@/types/Canvas";
import { GraphPaper } from "./GraphPaper";
import { getEmoji } from "@/utils/diary/getEmoji";
import { ChangeDateForm } from "./ChangeDateForm";
import EditButton from "./EditButton";

const DetailComponent = ({
  postData,
  setOpenClose,
  device
}: {
  postData: FormData;
  setOpenClose: booleanState;
  device: string;
}) => {
  return (
    <div
      className={`relative px-[13px] pb-[52px] lg:flex lg:px-4 lg:pb-[34px] gap-[18px] ${
        !postData.draw ? "lg:flex-col lg:w-[488px] lg:mx-auto lg:px-0" : device === "pc" && "pt-[75px]"
      }
      }`}
    >
      <div className={`${!postData.draw ? "lg:w-full" : "lg:w-1/2"}`}>
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

        {device === "pc" && (
          <div className={`flex gap-[10px] p-4 ${!postData.draw ? "justify-end my-1" : "absolute top-0 right-0"}`}>
            <EditButton post_id={postData.id} setOpenClose={setOpenClose} />
          </div>
        )}

        <div className="border border-black rounded-tr-lg rounded-tl-lg overflow-hidden">
          <div className="py-[14.5px] text-xl leading-tight text-center text-black bg-[#FCA697] border-b border-black">
            {postData.title}
          </div>
          {postData.draw && (
            <div className="relative">
              <img src={postData.draw} alt={postData.title} className="bg-white w-full" />
            </div>
          )}
        </div>
      </div>

      {postData.contents && (
        <div className={`${!postData.draw ? "lg:w-full" : "lg:w-1/2"}`}>
          {postData.type === "모눈종이" ? (
            <div className="flex flex-wrap font-Dovemayo text-[30px] lg:text-2xl mt-4 mb-[26px] lg:my-0">
              {GraphPaper(postData.contents)}
            </div>
          ) : (
            <div className="bg-detail-content text-2xl leading-loose my-[26px] font-Dovemayo">{postData.contents}</div>
          )}
        </div>
      )}
    </div>
  );
};
export default DetailComponent;
