"use client";

import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // // 가짜 사용자 데이터(supabase와 연결하면 이 부분은 supabase API로 변경)
  // const fakeUser = {
  //   email: "user@example.com",
  //   password: "password123"
  // };

  // 로그인 처리 함수
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setErrorMessage("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    try {
      // Supabase의 signInWithPassword 메서드로 로그인
      const { data, error } = await browserClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      console.log("로그인 성공: ", data);

      // 로그인 성공 후 페이지 이동
      if (isMounted) {
        router.push("/main");
      }
    } catch (error) {
      console.log("로그인 오류: ", error);
      setErrorMessage("로그인 중 문제가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div>
      <div>
        <h1>로그인</h1>

        {/* 에러 메세지 출력 */}
        {errorMessage && <p>{errorMessage}</p>}

        {/* 로그인 폼 */}
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email">이메일:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEamil(e.target.value)}
              required
              className="p-2 border border-gray-300"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password">비밀번호:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-300"
            />
          </div>

          {/* 자동 로그인 체크박스 */}
          <div>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe">자동 로그인</label>
          </div>

          <div>
            <button type="submit" className="p-2 border border-gray-300">
              로그인
            </button>
          </div>
        </form>

        <div className="gap-3">
          <a href="#" className="hover:underline">
            아이디 찾기
          </a>
          <a href="#" className="hover:underline">
            비밀번호 찾기
          </a>
          <a href="#" className="hover:underline">
            회원가입
          </a>
        </div>

        <div className="my-4 border-t border-gray-300"></div>
        <p className="text-center">간편 로그인</p>

        <div className="flex mt-4">
          <button className="p-2 border border-gray-300 mr-2">깃허브</button>
          <button className="p-2 border border-gray-300 mr-2">구글</button>
          <button className="p-2 border border-gray-300">카카오</button>
        </div>
      </div>
    </div>
  );
}
