import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        // cookieStore는 동기적으로 값을 반환하므로 바로 getAll() 호출
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // set 메서드로 쿠키를 설정
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // 서버 컴포넌트에서 setAll 메서드가 호출된 경우 에러 처리
          console.error(error);
        }
      }
    }
  });
}
