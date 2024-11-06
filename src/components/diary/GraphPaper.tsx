export const GraphPaper = (contents: string) => {
  const content = contents.split("");

  return content.map((word, idx) => (
    <div
      key={word + idx}
      className="w-[calc(100%/7)] text-center border-l [&:nth-child(7n+1)]:border-l-0 [&:nth-child(n+8)]:border-t border-[#BFBFBF]"
    >
      <span className="flex items-center justify-center h-0 py-[50%]">{word}</span>
    </div>
  ));
};
