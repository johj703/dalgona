import { getLoginUser } from "@/utils/getLoginUser";
import { useQuery } from "@tanstack/react-query";

export const useCheckLogin = () => {
  return useQuery({
    queryKey: ["loginUser"],
    queryFn: async () => {
      return await getLoginUser();
    },
    refetchOnMount: "always"
  });
};
