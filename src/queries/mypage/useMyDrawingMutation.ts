import { getMyDrawing } from "@/lib/mypage/getMyDrawing";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMyDrawingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getMyDrawing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDrawing"] });
    },
    onError: (error) => {
      console.error("그림 불러오는 중 오류 발생:", error);
    }
  });
};
