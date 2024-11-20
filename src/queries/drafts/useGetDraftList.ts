import { getDraftsById } from "@/lib/drafts/draftsUtils";
import { useQuery } from "@tanstack/react-query";

export const useGetDraftList = (userId: string) => {
  return useQuery({
    queryKey: ["drafts"],
    queryFn: async () => {
      if (userId) {
        return await getDraftsById(userId);
      } else {
        return null;
      }
    },
    refetchOnMount: "always"
  });
};
