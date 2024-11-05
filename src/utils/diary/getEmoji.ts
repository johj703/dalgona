export const EMOTION_LIST = [
  "기분최고예요",
  "즐거워요",
  "편안해요",
  "뿌듯해요",
  "화나요",
  "당황스러워요",
  "힘들어요",
  "걱정돼요",
  "슬퍼요",
  "외로워요"
];

export const getEmoji = (emotion: string) => {
  const nowEmotion = EMOTION_LIST.findIndex((item) => item === emotion);

  return `/icons/emotion-${nowEmotion + 1}.svg`;
};
