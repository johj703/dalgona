import useGetDevice from "@/hooks/useGetDevice";

export const GraphPaper = (contents: string) => {
  const device = useGetDevice();
  const textLength = device === "pc" ? 11 : 7;
  const content = contents.split("");
  for (let i = 0; i < content.length % textLength; i++) {
    content.push("");
  }

  return content.map((word, idx) => (
    <div
      key={word + idx}
      className="w-[calc(100%/7)] lg:w-[calc(100%/11)] text-center border-l [&:nth-child(7n+1)]:border-l-0 [&:nth-child(n+8)]:border-t lg:!border-t-0 lg:border-b lg:!border-l  lg:[&:nth-child(11n+1)]:!border-l-0  lg:[&:not(:nth-child(n+12))]:!border-t border-[#BFBFBF]"
    >
      <span className="flex items-center justify-center h-0 py-[50%]">{word}</span>
    </div>
  ));
};
