import SelectFeedCalendar from "@/components/main/SelectFeedCalendar";
import Navigation from "@/components/Navigation";

const MainPage = async () => {
  return (
    <>
      <div>
        <SelectFeedCalendar />
        <Navigation />
      </div>
    </>
  );
};

export default MainPage;
