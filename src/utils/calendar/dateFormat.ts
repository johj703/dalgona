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
