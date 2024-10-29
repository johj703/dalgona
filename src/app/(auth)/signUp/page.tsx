"use client";

import browserClient from "@/utils/supabase/client";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    // Supabase에 회원 정보 추가
    try {
      const { data, error } = await browserClient.auth.signUp({
        email,
        password
      });

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>

      {/* 에러 메세지 출력 */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* 회원가입 폼 */}
      <form onSubmit={handleSignUp} className="w-11/12 max-w-md bg-white p-6 rounded-lg shadow-md">
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력시 상태 업데이트
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-300">사용하실 이메일 주소를 입력하세요.</p>
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
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-300">안전한 비밀번호를 입력해주세요(8자 이상, 영문, 숫자 포함)</p>
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
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-300">비밀번호를 다시 입력해주세요.</p>
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
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-300">2글자 이상의 별명을 입력해 주세요.</p>
        </div>

        {/* "다음으로" 버튼 */}
        <div className="flex justify-center">
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            다음으로
          </button>
        </div>
      </form>
    </div>
  );
}