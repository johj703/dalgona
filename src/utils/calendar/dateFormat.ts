import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";

// yyyy년 mm월 dd일 -> yyyy-mm-dd로 변환 & Date 객체로 변환
export const formatDate = (date: string) => {
  const [year, month, day] = date
    .replace("년", "")
    .replace("월", "")
    .replace("일", "")
    .split(" ")
    .map((str) => parseInt(str.trim(), 10));
  return new Date(year, month - 1, day);
};

// yyyy-mm-dd -> yyyy년 mm월 dd일
export const formatDateToKo = (date: string) => {
  const dateObj = new Date(date);
  const formatDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(dateObj);
  return formatDate;
};

//yyyy년 mm월 dd일의 요일구하기
export const getDayOfTheWeek = (date: string) => {
  //yyyy년 mm월 dd일 -> yyyy년mm월dd일
  const replacedDate = date.replace(/\s/g, "");
  const parsedDate = parse(replacedDate, "yyyy년MM월dd일", new Date());
  const dayOfWeek = format(parsedDate, "EEEE", { locale: ko });
  return dayOfWeek;
};
