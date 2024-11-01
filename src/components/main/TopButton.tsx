import Image from "next/image";
import topButton from "../../../public/images/topButton.png";

const TopButton = () => {
  const handleTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <div className="fixed bottom-[55px] right-2 z-50">
      <Image src={topButton} width={30} height={30} alt="Picture of the author" onClick={handleTop} />
    </div>
  );
};

export default TopButton;
