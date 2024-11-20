import browserClient from "@/utils/supabase/client";

export const logoutUser = async () => {
  const { error } = await browserClient.auth.signOut();

  if (error) {
    console.error("일기 삭제 실패 =>", error);
    throw new Error("일기 삭제하는 중 오류가 발생했습니다." + error.message);
  }
  alert("로그아웃이 완료 되었습니다.");
  return (window.location.href = "/sign-in");
};
