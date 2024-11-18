import { getMyDrawing } from "@/lib/mypage/getMyDrawing";
import { useQuery } from "@tanstack/react-query";

export const useGetMyDrawing = (userId: string, device: string) => {
  return useQuery({
    queryKey: ["myDrawing"],
    queryFn: async () => {
      if (userId) {
        return await getMyDrawing({ userId, device });
      } else {
        return null;
      }
    },
    enabled: !!userId
  });
};
