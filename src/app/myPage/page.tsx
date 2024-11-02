import React from "react";
import Link from "next/link";

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>마이페이지</h1>
      <Link href="/mypage/artwork">내 그림 모아보기</Link>
    </div>
  );
};

export default MyPage;
