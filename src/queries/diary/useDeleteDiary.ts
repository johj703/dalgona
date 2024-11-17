import { deleteDiaryById } from "@/utils/diary/diaryData";
import { useQuery } from "@tanstack/react-query";

export const useDeleteDiary = (diaryId: string) => {
  return useQuery({
    queryKey: ["deleteDiary"],
    queryFn: async () => {
      if (diaryId) {
        return await deleteDiaryById(diaryId);
      } else {
        return null;
      }
    },
    enabled: !!diaryId
  });
};
