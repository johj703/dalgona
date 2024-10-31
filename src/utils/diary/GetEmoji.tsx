export const GetEmoji = (emotion: string) => {
  switch (emotion) {
    case "행복해요":
      return <img src="happy.png" alt="행복해요" />;
    case "좋아요":
      return <img src="good.png" alt="좋아요" />;
    case "그냥 그래요":
      return <img src="soso.png" alt="그냥 그래요" />;
    case "별로에요":
      return <img src="bad.png" alt="별로에요" />;
    case "힘들어요":
      return <img src="tired.png" alt="힘들어요" />;
  }
};
