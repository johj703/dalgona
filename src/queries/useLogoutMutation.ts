import { logoutUser } from "@/lib/logoutUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loginUser"] });
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onError: (error) => {
      console.error("로그아웃 중 오류 발생:", error);
    }
  });
};
