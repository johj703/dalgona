"use client";
import SelectFeedCalendar from "@/components/main/SelectFeedCalendar";
import Navigation from "@/components/Navigation";
import Header from "@/components/layout/Header";
import useGetDevice from "@/hooks/useGetDevice";

const MainPage = () => {
  const device = useGetDevice();
  return (
    <>
      {device === "pc" && <Header />}
      <div className="lg:flex lg:flex-col lg:justify-center lg:items-center ">
        <SelectFeedCalendar />
        <Navigation />
      </div>
    </>
  );
};

export default MainPage;
