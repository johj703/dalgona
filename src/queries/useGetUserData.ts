import { getUserData } from "@/lib/mypage/getUserData";
import { useQuery } from "@tanstack/react-query";

export const useGetUserData = (userId: string) => {
  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      if (userId) {
        return await getUserData(userId);
      } else {
        return null;
      }
    },
    enabled: !!userId
  });
};
