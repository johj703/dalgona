import Image from "next/image";

const TopButton = () => {
  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <div
        className="flex w-[56px] h-[56px] p-[16px] items-center gap-[10px] fixed z-50 right-[calc((100vw-408px)/2)] bottom-[61px] rounded-full bg-[#E89080] cursor-pointer"
        onClick={handleTop}
      >
        <div className="flex w-[24px] h-[24px] justify-center items-center gap-[24px] shrink-0">
          <Image src="/icons/arrow-top.svg" width={12} height={12} alt="arrow-top" className="shrink-0" />
        </div>
      </div>
    </>
  );
};

export default TopButton;

//
