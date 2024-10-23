import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // 이 `try/catch` 블록은 상호작용 튜토리얼을 위한 것입니다.
  // Supabase 연결이 완료되면 자유롭게 제거할 수 있습니다.
  try {
    // 수정되지 않은 응답을 생성합니다.
    let response = NextResponse.next({
      request: {
        headers: request.headers
      }
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request
            });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          }
        }
      }
    );

    // 만료된 세션을 갱신합니다. (서버 컴포넌트에서 필요함)
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    await supabase.auth.getUser();

    return response;
  } catch (error) {
    // 여기로 온 경우, Supabase 클라이언트를 생성하지 못한 것입니다!
    // 이는 환경 변수가 설정되지 않았기 때문일 가능성이 큽니다.
    // 다음 단계에 대한 정보를 보려면 http://localhost:3000을 확인하세요.
    console.error(error);
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }
};
