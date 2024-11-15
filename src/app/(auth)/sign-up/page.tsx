"use client";

import CommonTitle from "@/components/CommonTitle";
import browserClient from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  console.log(setEmail);

  // 회원가입 버튼을 클릭했을 때 호출되는 함수
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 입력칸이 채워졌는지 확인
    if (email === "" || password === "" || nickname === "") {
      setErrorMessage("모든 항목을 입력해 주세요.");
      return;
    }

    // 비밀번호 유효성 검사(8자 이상, 영문과 숫자 포함)
    const passwordValid = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(password);
    if (!passwordValid) {
      setErrorMessage("비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.");
      return;
    }

    // 비밀번호 확인 일치 여부 검사
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 별명 유효성 검사(별명은 2자 이상이어야 함)
    if (nickname.length < 2) {
      setErrorMessage("별명은 2글자 이상이어야 합니다.");
      return;
    }

    // ** 데이터가 입력이 되면 로그인이 실행되고(이 때, 테이블에 추가가 되는것으로 작성하기) 회원가입2로 이동하도록 작성
    try {
      // Supabase에 회원 정보 추가 및 회원가입 요청
      const { data, error } = await browserClient.auth.signUp({
        email,
        password
      });

      // 회원가입 요청에 성공한 경우 실행
      if (data) {
        // 별명(nickname)을 포함한 데이터를 users 테이블에 추가
        const { error: dbError } = await browserClient.from("users").insert({
          email,
          nickname,
          name
        });

        // 데이터 베이스 삽입 중 오류가 발생한 경우 오류 메시지 설정 후 종료
        if (dbError) {
          setErrorMessage("회원 데이터 추가 중 오류가 발생했습니다.");
          return;
        }

        // 회원가입이 완료되면 리디렉션으로 sign-up/profile로 이동
        router.push("/sign-up/profile");
        console.log("회원가입 성공", data);
      }

      if (error) {
        setErrorMessage(error.message);
      } else {
        console.log("회원가입 성공: ", data);
      }
    } catch (error) {
      console.log("회원가입 중 오류 발생", error);
      setErrorMessage("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background02">
      <CommonTitle title="회원가입" />

      {/* 에러 메세지 출력 */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* 회원가입 폼 */}
      <form onSubmit={handleSignUp} className="flex-1 flex flex-col mt-[58px] px-4 pb-[22px]">
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="label-style">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력시 상태 업데이트
            required
            className="input-style"
            placeholder="이메일을 입력하세요"
          />
          <p className="mt-1 text-sm leading-normal text-gray04">사용하실 이메일 주소를 입력하세요.</p>
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 입력시 상태 업데이트
            required
            className="input-style"
            placeholder="비밀번호를 입력하세요"
          />
          <p className="mt-1 text-sm leading-normal text-gray04">
            안전한 비밀번호를 입력해주세요(8자 이상, 영문, 숫자 포함)
          </p>
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // 입력시 상태 업데이트
            required
            className="input-style"
          />
          <p className="mt-1 text-sm leading-normal text-gray04">비밀번호를 다시 입력해주세요.</p>
        </div>

        {/* 이름 입력 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)} // 입력시 상태 업데이트
            required
            className="input-style"
            placeholder="이름을 입력하세요"
          />
          <p className="mt-1 text-sm leading-normal text-gray04">이름을 입력해 주세요.</p>
        </div>

        {/* 별명 입력 */}
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            별명
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} // 입력시 상태 업데이트
            required
            className="input-style"
            placeholder="별명을 입력하세요"
          />
          <p className="mt-1 text-sm leading-normal text-gray04">2글자 이상의 별명을 입력해 주세요.</p>
        </div>

        {/* "다음으로" 버튼 */}
        <div className="flex justify-center mt-auto">
          <button
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-lg text-sm leading-[1.35] hover:bg-primary"
          >
            다음으로
          </button>
        </div>
      </form>
    </div>
  );
}
