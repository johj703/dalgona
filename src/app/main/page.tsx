import SelectFeedCalendar from "@/components/main/SelectFeedCalendar";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getInitialDiaries } from "@/queries/fetchDiaries";

const MainPage = async () => {
  //NOTE - 일기정보 가져오기
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    //prefetchQuery로 클라이언트 캐시에 데이터를 추가
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
        <div className="p-2 m-2">
          <SelectFeedCalendar />
        </div>
      </HydrationBoundary>
    </>
  );
};

export default MainPage;
