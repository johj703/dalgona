import SelectFeedCalendar from "@/components/main/SelectFeedCalendar";
import Navigation from "@/components/Navigation";

const MainPage = async () => {
  return (
    <>
      <div className="lg:flex lg:flex-col lg:justify-center lg:items-center ">
        <SelectFeedCalendar />
        <Navigation />
      </div>
    </>
  );
};

export default MainPage;
