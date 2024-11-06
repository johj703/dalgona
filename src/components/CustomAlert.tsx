import Image from "next/image";

type CustomAlertProps = {
  type: string;
  text: string;
  position: string;
};
export const CustomAlert = ({ type, text, position }: CustomAlertProps) => {
  return (
    <div
      className={`flex items-center gap-[10px] w-max max-w-full py-2 px-4 rounded-lg text-sm leading-normal border ${position} ${
        type === "success"
          ? "border-[#2E5342] text-[#2E5342] bg-[#ECFFF6]"
          : "border-[#D84E35] text-[#D84E35] bg-[#FFEFEF]"
      }`}
    >
      <Image src={`/icons/${type}.svg`} alt={type} width={18} height={18} />
      {text}
    </div>
  );
};
