"use client";

import Link from "next/link";
import Checkbox from "../../../components/signIn/CheckBox";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 가짜 사용자 데이터(supabase와 연결하면 이 부분은 supabase API로 변경)
  const fakeUser = {
    email: "user@example.com",
    password: "password123"
  };

  // 로그인 처리 함수
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // 입력한 이메일과 비밀번호가 가짜 사용자 데이터와 일치하는지 확인
    if (email === fakeUser.email && password === fakeUser.password) {
      console.log("로그인 성공");
      // 로그인 성공 후 리다이렉트
      router.push("/dashboard");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn} className="space-y-2">
        <div>
          <label>이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEamil(e.target.value)}
            className="border border-black"
            placeholder="이메일"
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-black"
            placeholder="비밀번호"
          />
        </div>
      </form>
      <div className="flex">
        <Checkbox />
        <p>자동 로그인</p>
      </div>
      <button className="border border-black">로그인</button>
      <div className="space-x-2">
        <Link href="">아이디 찾기</Link>
        <Link href="">비밀번호 찾기</Link>
        <Link href="">회원가입</Link>
      </div>
      <hr />
    </div>
  );
}
