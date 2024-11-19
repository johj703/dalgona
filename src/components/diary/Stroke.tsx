import { LineCustom } from "@/types/LineCustom";

type StrokeProps = {
  lineCustom: LineCustom;
  handleChangeCustom: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const Stroke = ({ lineCustom, handleChangeCustom }: StrokeProps) => {
  return (
    <div className="absolute bottom-full flex items-center gap-4 w-full py-[22px] px-8 rounded-tl-lg rounded-tr-lg overflow-x-auto scrollbar-hide bg-[#404040] lg:-top-[88px] lg:bottom-auto lg:left-full lg:w-[calc(100dvh-74px)] lg:h-[88px] lg:px-8 lg:py-0 lg:rotate-90 lg:rounded-none lg:origin-bottom-left">
      <div className="relative w-full h-4 bg-[rgba(255,255,255,0.5)] rounded-[10px] lg:max-w-[324px]">
        <span
          className={`relative block h-4 bg-[#2BCFF2] transition rounded-l-[10px]`}
          style={{ width: `${((Number(lineCustom.lineWidth) - 1) / 30) * 100}%` }}
        >
          <label
            htmlFor="lineWidth"
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 w-7 h-7 bg-white rounded-full"
          ></label>
        </span>
        <input
          type="range"
          name="lineWidth"
          id="lineWidth"
          min={1}
          max={30}
          value={lineCustom.lineWidth}
          step={1}
          onChange={(e) => handleChangeCustom(e)}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-7 appearance-none opacity-0"
        />
      </div>
    </div>
  );
};
export default Stroke;
