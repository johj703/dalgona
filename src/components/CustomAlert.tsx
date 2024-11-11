import Image from "next/image";

type CustomAlertProps = {
  type: string;
  text: string;
  position: string;
};
export const CustomAlert = ({ type, text, position }: CustomAlertProps) => {
  return (
    <div
      className={`animate-alert-blink opacity-0 flex items-center gap-[10px] w-max max-w-full py-2 px-4 rounded-lg text-sm leading-normal border ${position} ${
        type === "success" ? "border-utility03 text-utility03 bg-[#ECFFF6]" : "border-primary text-primary bg-[#FFEFEF]"
      }`}
    >
      <Image src={`/icons/${type}.svg`} alt={type} width={18} height={18} />
      {text}
    </div>
  );
};
