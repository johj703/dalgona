export const EMOTION_LIST = ["행복해요", "편안해요", "설레요", "뿌듯해요", "힘들어요", "우울해요", "슬퍼요", "화나요"];

export const getEmoji = (emotion: string, isOn: string) => {
  const nowEmotion = EMOTION_LIST.findIndex((item) => item === emotion);

  return `/icons/emotion-${isOn}-${nowEmotion + 1}.svg`;
};
