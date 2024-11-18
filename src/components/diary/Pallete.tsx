import { LineCustom } from "@/types/LineCustom";

const initialColorList = ["#000000", "#FF5C5C", "#FFDA6B", "#69D7EE", "#62E371"];

type PalleteProps = {
  lineCustom: LineCustom;
  setLineCustom: React.Dispatch<React.SetStateAction<LineCustom>>;
  handleChangeCustom: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Pallete = ({ lineCustom, setLineCustom, handleChangeCustom }: PalleteProps) => {
  const isCustom = initialColorList.find((item) => item === lineCustom.lineColor) === undefined && true;

  return (
    <div className="absolute bottom-full flex items-center gap-4 w-full pt-4 pb-3 rounded-tl-lg rounded-tr-lg overflow-x-auto scrollbar-hide bg-[#404040] lg:-top-[88px] lg:bottom-auto lg:left-full lg:w-[calc(100dvh-74px)] lg:h-[88px] lg:px-8 lg:py-0 lg:rotate-90 lg:rounded-none lg:origin-bottom-left">
      {initialColorList.map((color) => {
        return (
          <div
            key={color}
            className={`relative flex-shrink-0 w-10 h-10 rounded-full lg:-rotate-90 first:ml-auto first:lg:ml-0 ${
              lineCustom.lineColor === color && "flex items-center justify-center w-11 h-11 border-white border-[3px]"
            }`}
            style={{ background: color }}
            onClick={() => setLineCustom({ ...lineCustom, lineColor: color })}
          >
            {lineCustom.lineColor === color && <img src="/icons/check-white.svg" alt="체크" />}
          </div>
        );
      })}

      <div
        className={`relative flex-shrink-0 rounded-full overflow-hidden mr-auto lg:-rotate-90 lg:mr-0 ${
          isCustom ? "w-11 h-11 border-white border-[3px]" : "w-10 h-10"
        }`}
      >
        <input
          type="color"
          name="lineColor"
          id="lineColor"
          value={lineCustom.lineColor}
          onChange={(e) => {
            handleChangeCustom(e);
          }}
          className="z-20 absolute opacity-0 w-full h-full"
        />
        {isCustom && (
          <img
            src="/icons/check-white.svg"
            alt="체크"
            className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        <img src="/icons/color-input.png" alt="색상 선택" className="w-full h-full" />
      </div>
    </div>
  );
};
export default Pallete;
