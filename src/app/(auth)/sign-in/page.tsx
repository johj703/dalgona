"use client";

import Modal from "@/components/Modal";
import browserClient from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openClose, setOpenClose] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 로그인 처리 함수
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // 초기화
    setEmailError("");
    setPasswordError("");

    // 이메일과 비밀번호 입력 값이 비어 있는지 확인
    if (email === "" || password === "") {
      if (email === "") setEmailError("이메일을 입력해 주세요.");
      if (password === "") setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      setEmailError("유효한 이메일 주소를 입력해 주세요.");
      return;
    }

    try {
      // Supabase의 signInWithPassword 메서드로 로그인
      const { data, error } = await browserClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log("Supabase 오류 디버깅: ", error);

        // Supabase의 오류 메세지 분석
        const errorMessage = error.message;
        if (errorMessage.includes("잘못된 로그인 자격 증명")) {
          // 잘못된 이메일과 비밀번호
          setEmailError("아이디를 다시 확인해 주세요.");
          setPasswordError("비밀번호가 잘못 입력되었습니다. 다시 확인해주세요.");
        } else if (errorMessage.includes("유효하지 않은 이메일")) {
          // 이메일 형식이 올바르지 않은 경우
          setEmailError("유효하지 않은 이메일 형식입니다.");
        } else if (errorMessage.includes("비밀번호가 잘못되었습니다.")) {
          // 비밀번호가 잘못된 경우
          setPasswordError("비밀번호가 잘못 입력되었습니다. 다시 확인해주세요.");
        } else {
          setErrorMessage("로그인에 실패했습니다. 관리자에게 문의하세요.");
          setOpenClose(true);
        }
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
      setOpenClose(true);
    }
  };

  return (
    <div className="flex flex-col items-center pt-[68px] px-4 lg:justify-center lg:h-screen">
      <div className="p-[10px]">
        <img src="/icons/logo.svg" alt="로고" className="w-auto h-9 lg:h-10" />
      </div>

      {/* 에러 메세지 출력 */}
      {openClose && <Modal mainText="안내" subText={errorMessage} setModalState={setOpenClose} />}

      {/* 로그인 폼 */}
      <form onSubmit={handleSignIn} className="mt-5 lg:mt-12">
        {/* 이메일 입력 */}
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`input-style ${emailError ? "border-red-500" : ""}`}
          placeholder="이메일"
        />
        {/* 이메일 오류 메세지 */}
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

        {/* 비밀번호 입력 */}
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`input-style mt-4 ${passwordError ? "border-red-500" : ""}`}
          placeholder="비밀번호"
        />
        {/* 비밀번호 오류 메세지 */}
        {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}

        {/* 자동 로그인 체크박스 */}
        {/* UT 미구현 */}
        <div className="relative hidden items-center gap-[10px] mt-5">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 peer"
          />
          <span className="bg-checkbox-off peer-checked:bg-checkbox-on w-6 h-6"></span>
          <label htmlFor="rememberMe" className="text-sm">
            자동 로그인
          </label>
        </div>

        <button
          type="submit"
          className="mt-[31px] py-[14.5px] w-full text-lg leading-[1.35] text-white rounded-lg bg-primary"
        >
          로그인
        </button>
      </form>

      <div className="flex justify-between mt-[26px]">
        {/* UT 미구현 */}
        {/* <a href="#" className="hover:underline">
          아이디 찾기
        </a>
        <a href="#" className="hover:underline">
          비밀번호 찾기
        </a> */}
        <Link href={"/sign-up"} className="text-base leading-tight">
          회원가입
        </Link>
      </div>

      {/* UT 미구현 */}
      <div className="hidden w-full mt-[73px]">
        <p className="flex gap-[27px] items-center text-sm leading-4 before:flex-1 before:h-[1px] before:bg-gray03 after:flex-1 after:h-[1px] after:bg-gray03">
          간편 로그인
        </p>

        <div className="flex justify-center mt-[18px] gap-[14px]">
          <button className="p-2 border-gray-200 rounded">깃허브</button>
          <button className="p-2 border-gray-200 rounded">구글</button>
          <button className="p-2 border-gray-200 rounded">카카오</button>
        </div>
      </div>
    </div>
  );
}
