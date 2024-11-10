import { calDate } from "../../utils/diary/calDate";

export const ChangeDateForm = (date: string) => {
  const Year = date.split("년")[0].slice(-2);
  const Month = date.split("월")[0].slice(-2);
  const Day = date.split("일")[0].slice(-2);
  const GetDate = calDate(new Date(`${date.split("년")[0]}-${Month}-${Day}`).getDay());

  return (
    <>
      <div className="text-[22px] leading-5">
        {Year}. {Month}
      </div>
      <div className="text-[46px] leading-10 text-[#BB433E]">{Day}</div>
      <div className="text-base leading-5">{GetDate}요일</div>
    </>
  );
};
