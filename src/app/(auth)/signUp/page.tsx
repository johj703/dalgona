"use client";

import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
