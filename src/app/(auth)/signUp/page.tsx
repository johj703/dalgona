"use client";

import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 회원가입 버튼을 클릭했을 때 호출되는 함수
  const handleSignUp = (e: React.FormEvent) => {
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

    // 별명 유효성 검사(별명은 2자 이상이어야 함)
    if (nickname.length < 2) {
      setErrorMessage("별명은 2글자 이상이어야 합니다.");
      return;
    }

    console.log("회원가입 성공:", { email, password, nickname });
  };

  return (
    <div>
      <h1>회원가입</h1>

      {/* 에러 메세지 출력 */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* 회원가입 폼 */}
      <form onSubmit={handleSignUp}>
        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력시 상태 업데이트
            required
            className="border border-black"
            placeholder="사용하실 이메일 주소를 입력하세요."
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 입력시 상태 업데이트
            required
            className="border border-black"
            placeholder="안전한 비밀번호를 입력해 주세요.(8자 이상, 영뭉, 숫자 포함)"
          />
        </div>

        {/* 별명 입력 */}
        <div>
          <label htmlFor="nickname">별명</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} // 입력시 상태 업데이트
            required
            className="border border-black"
            placeholder="2글자 이상의 별명을 입력해주세요."
          />
        </div>

        {/* "다음으로" 버튼 */}
        <div>
          <button type="submit" className="border border-black">
            다음으로
          </button>
        </div>
      </form>
    </div>
  );
}
