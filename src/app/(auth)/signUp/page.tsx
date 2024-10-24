"use client";

import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "" || password === "" || nickname === "") {
      setErrorMessage("모든 항목을 입력해 주세요.");
      return;
    }

    const passwordValid = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(password);
    if (!passwordValid) {
      setErrorMessage("비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.");
      return;
    }

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
            onChange={(e) => setEmail(e.target.value)}
            required
            className=""
            placeholder="사용하실 이메일 주소를 입력하세요."
          />
        </div>
      </form>
    </div>
  );
}
