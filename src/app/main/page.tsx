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
      <SelectFeedCalendar />
      <Navigation />
    </>
  );
};

export default MainPage;
