import SelectFeedCalendar from "@/components/main/SelectFeedCalendar";
import DiaryList from "@/components/main/DiaryList";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getInitialDiaries } from "@/queries/fetchDiaries";
// import { getMonth, getYear } from "date-fns";

const MainPage = async () => {
  // const currentMonth = new Date();
  // const year = getYear(currentMonth);
  // const month = getMonth(currentMonth) + 1;
  //현재 달의 시작일 2024-10-01
  // const firstDayOfMonth = startOfMonth(currentMonth).toLocaleDateString().replace(/\./g, "").replace(/\s/g, "-");
  //현재 달의 마지막 날 2024-10-31
  // const lastDayOfMonth = endOfMonth(firstDayOfMonth).toLocaleDateString().replace(/\./g, "").replace(/\s/g, "-");
  // //현재 달의 날의 수 구하기
  // const daysInMonth = getDaysInMonth(currentMonth);

  //일기정보 가져오기
  const queryClient = new QueryClient();
  //prefetchQuery로 클라이언트 캐시에 데이터를 추가
  await queryClient.prefetchQuery({
    queryKey: ["diaries"], // 전체 데이터를 캐싱
    queryFn: () => getInitialDiaries()
  });

  //서버에서 미리 데이터를 가져와 prefetch한 데이터를
  //클라이언트 측에서 캐시된 상태로 접근하는 방식으로 구현
  // dehydrate로 캐시된 데이터를 클라이언트에 넘김
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <HydrationBoundary state={dehydratedState}>
        <div className="p-2 m-2 border-2">
          <SelectFeedCalendar />
        </div>
        <div className="p-2 m-2 border-2">
          <DiaryList />
        </div>
      </HydrationBoundary>
    </>
  );
};

export default MainPage;
