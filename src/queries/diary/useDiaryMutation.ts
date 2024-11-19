import { deleteDiaryById } from "@/lib/diary/diaryData";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteDiaryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiaryById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
    },
    onError: (error) => {
      console.error("삭제 중 오류 발생:", error);
    }
  });
};
