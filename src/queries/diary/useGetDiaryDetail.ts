import { getDiaryById } from "@/lib/diary/diaryData";
import { useQuery } from "@tanstack/react-query";

export const useGetDiaryDetail = (diaryId: string) => {
  return useQuery({
    queryKey: ["diaryDetail"],
    queryFn: async () => {
      if (diaryId) {
        return await getDiaryById(diaryId);
      } else {
        return null;
      }
    },
    refetchOnMount: "always"
  });
};
