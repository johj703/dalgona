"use client";

import browserClient from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // sign-up 페이지로 이동하는 함수
  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm p-4 rounded-md lg:max-w-md xl:max-w-lg lg:p-8">
        <div className="flex justify-center items-center">
          <Image
            src="/icons/Header.jpg"
            alt="달고나 타이틀 이미지"
            width={150}
            height={50}
            priority // 타이틀 이미지를 페이지 로딩 시 최우선으로 가져오는 속성
          />
        </div>

        {/* 에러 메세지 출력 */}
        {errorMessage && <p className="text-center text-red-500 mb-4">{errorMessage}</p>}

        {/* 로그인 폼 */}
        <form onSubmit={handleSignIn} className="space-y-4 mt-5">
          {/* 이메일 입력 */}
          <div>
            <input
              type="email"
              id="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-style"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-style"
            />
          </div>

          {/* 자동 로그인 체크박스 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm">
              자동 로그인
            </label>
          </div>

          <div>
            <button type="submit" className="w-full p-2 bg-primary text-white rounded">
              로그인
            </button>
          </div>
        </form>

        <div className="flex justify-center text-sm mt-4">
          {/* <a href="#" className="hover:underline">
            아이디 찾기
          </a>
          <a href="#" className="hover:underline">
            비밀번호 찾기
          </a> */}
          <button onClick={handleSignUp} className="hover:underline">
            회원가입
          </button>
        </div>

        <div className="mt-16">
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-sm">간편 로그인</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center mt-4 gap-1">
            <button className="p-2 border-gray-200 rounded">
              <Image src="/icons/Icon-Github.png" alt="깃허브 로그인" width={40} height={40} />
            </button>
            <button className="p-2 border-gray-200 rounded">
              <Image src="/icons/Icon-Google.png" alt="구글 로그인" width={40} height={40} />
            </button>
            <button className="p-2 border-gray-200 rounded">
              <Image src="/icons/Icon-Kakaotalk.png" alt="카카오 로그인" width={40} height={40} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
