import { CalDate } from "./CalDate";

export const ChangeDateForm = (date: string) => {
  const Year = date.split("년")[0].slice(-2);
  const Month = date.split("월")[0].slice(-2);
  const Day = date.split("일")[0].slice(-2);
  const GetDate = CalDate(new Date(`${date.split("년")[0]}-${Month}-${Day}`).getDay());

  return (
    <>
      <div>
        {Year}. {Month}
      </div>
      <div>{Day}</div>
      <div>{GetDate}</div>
    </>
  );
};
