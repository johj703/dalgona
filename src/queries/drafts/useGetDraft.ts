import { getDraftById } from "@/lib/drafts/draftsUtils";
import { useQuery } from "@tanstack/react-query";

export const useGetDraft = (diaryId: string) => {
  return useQuery({
    queryKey: ["draft"],
    queryFn: async () => {
      if (diaryId) {
        return await getDraftById(diaryId);
      } else {
        return null;
      }
    },
    refetchOnMount: "always"
  });
};
