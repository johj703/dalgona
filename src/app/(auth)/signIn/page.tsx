"use client";

import Link from "next/link";
import Checkbox from "../../../components/signIn/CheckBox";

export default function signInPage() {
  return (
    <div>
      <div className="space-y-2">
        <div>
          <input className="border border-black" placeholder="이메일" />
        </div>
        <div>
          <input className="border border-black" placeholder="비밀번호" />
        </div>
      </div>
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
