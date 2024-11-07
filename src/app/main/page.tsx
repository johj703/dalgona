import SelectFeedCalendar from "@/components/main/SelectFeedCalendar";
// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
// import { getInitialDiaries } from "@/lib/main/fetchDiaries";
import Navigation from "@/components/Navigation";

const MainPage = async () => {
  //NOTE - 일기정보 가져오기
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["diaries"],
  //   queryFn: () => getInitialDiaries()
  // });
  // const dehydratedState = dehydrate(queryClient);

  return (
    <>
      {/* <HydrationBoundary state={dehydratedState}> */}
      <div>
        <SelectFeedCalendar />
        <Navigation />
      </div>
      {/* </HydrationBoundary> */}
    </>
  );
};

export default MainPage;
