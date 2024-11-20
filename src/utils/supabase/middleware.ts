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

    // sign-up, sign-in 페이지는 퍼블릭으로 설정해서 누구든지 접근 가능하고,
    // 나머지 페이지는 주소를 통해 접근을 하면 로그인 페이지로 redirect되도록 작성
    const user = await supabase.auth.getUser();
    if (
      !request.nextUrl.pathname.startsWith("/sign-up") &&
      !request.nextUrl.pathname.startsWith("/sign-in") &&
      user.error &&
      !user.data.user
    ) {
      if (request.nextUrl.pathname !== "/") return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // 이 코드 때문에 회원가입1에서 다음으로 버튼을 클릭하면 바로 회원가입이 실행되고 main페이지로 넘어갔던 이유였음.
    // if (
    //   (request.nextUrl.pathname.startsWith("/sign-in") || request.nextUrl.pathname.startsWith("/sign-up")) &&
    //   user.data.user
    // ) {
    //   return NextResponse.redirect(new URL("/main", request.url));
    // }

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
