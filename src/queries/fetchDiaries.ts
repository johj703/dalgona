import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

//NOTE - 처음 일기 데이터 받아오기
export const getInitialDiaries = async () => {
  const supabase = createClient();
  const { data: initialDiaries } = await supabase.from("diary").select().order("date", { ascending: false });
  return initialDiaries;
};

//NOTE - useQuery로 fetch하기
export const useFetchDiaries = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["diaries"],
    queryFn: async () => {
      return await getInitialDiaries();
    },
    staleTime: 1000 * 60 * 5
  });
  return { data, error, isLoading };
};

// export const getInitialDiaries = async (firstDayOfMonth: string, lastDayOfMonth: string) => {
//   const supabase = createClient();
//   const { data: initialDiaries } = await supabase
//     .from("diary")
//     .select()
//     .gte("date", firstDayOfMonth)
//     .lt("date", lastDayOfMonth)
//     .order("date", { ascending: true });
//   //브라우저, 서버에서 뿌려줌..?
//   console.log("initialDiaries===>", initialDiaries);

//   return initialDiaries;
// };

//NOTE -
// 유저아이디, 년, 월 props로 받을 예정
// 역할: 유저아이디, 년, 월 값을 기반으로 데이터베이스에서 일기 데이터를 직접 가져오는 역할
// fetchSchedules: 단순한 API 호출이며 React와는 직접적인 연관이 없습니다.
// export const fetchDiaries = async () => {
//   const supabase = createClient();
//   const currentMonth = new Date();
//   const firstDayOfMonth = startOfMonth(currentMonth).toLocaleDateString().replace(/\./g, "").replace(/\s/g, "-");
//   const lastDayOfMonth = endOfMonth(firstDayOfMonth).toLocaleDateString().replace(/\./g, "").replace(/\s/g, "-");

//   const { data: diary, error } = await supabase
//     .from("diary")
//     .select()
//     .gte("date", firstDayOfMonth)
//     .lt("date", lastDayOfMonth)
//     .order("date", { ascending: true });

//   if (error) throw error;

//   return diary;
// };

//NOTE - 일기가져오기
//역할: React 컴포넌트에서 사용할 수 있도록 fetchDiaries 함수를 감싸는 역할
//이 함수는 React Query 라이브러리를 사용하여 데이터 요청, 캐싱, 자동 재요청 등을 관리
//React Query를 사용하여 캐시 및 데이터 상태를 관리하는 함수
// export const useFetchDiaries = () => {};
