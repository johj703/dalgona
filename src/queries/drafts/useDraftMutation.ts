import { deleteDraftsById } from "@/lib/drafts/draftsUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteDraftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDraftsById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts"] });
    },
    onError: (error) => {
      console.error("삭제 중 오류 발생:", error);
    }
  });
};
