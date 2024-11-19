import { useGetMonthlyEmotion } from "@/queries/mypage/useGetMonthlyEmotion";
import { EMOTION_LIST, getEmoji } from "@/utils/diary/getEmoji";

const MonthlyEmotion = ({ userId }: { userId: string }) => {
  const { data: monthlyData, isLoading } = useGetMonthlyEmotion(userId);
  if (isLoading) return;
  return (
    <div className="mt-[19px] lg:mt-0 lg:p-4 lg:flex flex-col items-center gap-4">
      <div className="px-4 py-2 text-base leading-5 lg:p-0 lg:text-xl lg:leading-normal">이번 달 감정 모아보기</div>

      <ul className="flex gap-10 px-4 py-[8.5px] overflow-x-auto lg:p-0 lg:gap-4 lg:overflow-visible">
        {EMOTION_LIST.map((emoji, idx) => {
          return (
            <li key={"emoji" + idx} className="flex-shrink-0 flex flex-col items-center gap-1 lg:gap-3">
              <img src={getEmoji(emoji, "on")} alt={emoji} className="w-[50px] h-[50px] lg:w-[68px] lg:h-[68px]" />
              <span className="text-base leading-normal lg:text-xl lg:leading-none">{monthlyData![idx]}</span>
              <span className="text-xs leading-5 text-[#414141] font-Dovemayo lg:text-base lg:leading-none">
                {emoji}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default MonthlyEmotion;
