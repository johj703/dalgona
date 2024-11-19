import { getMonthlyEmotion } from "@/lib/mypage/getMonthlyEmotion";
import { useQuery } from "@tanstack/react-query";

export const useGetMonthlyEmotion = (userId: string) => {
  return useQuery({
    queryKey: ["monthlyEmotion"],
    queryFn: async () => {
      if (userId) {
        return await getMonthlyEmotion(userId);
      } else {
        return null;
      }
    },
    enabled: !!userId
  });
};
