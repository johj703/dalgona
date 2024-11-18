import { logoutUser } from "@/lib/logoutUser";
import { useQuery } from "@tanstack/react-query";

export const useLogout = () => {
  return useQuery({
    queryKey: ["loginUser"],
    queryFn: async () => {
      return await logoutUser();
    }
  });
};
