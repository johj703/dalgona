export const GraphPaper = (contents: string) => {
  const content = contents.split("");

  return content.map((word, idx) => <span key={word + idx}>{word}</span>);
};
