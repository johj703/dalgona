export const GraphPaper = (contents: string) => {
  const content = contents.split("");

  return content.map((word, idx) => (
    <span key={word + idx} className="w-1/12 text-center border border-black">
      {word}
    </span>
  ));
};
