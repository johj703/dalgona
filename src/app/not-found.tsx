"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-screen py-8 pb-20 m-auto max-w-custom container">
      <article className="flex flex-col items-center gap-6 p-4">
        <div className="txt">
          <h2 className="font-bold">404 - 페이지를 찾을 수 없습니다!</h2>
          <p className="mt-8 flex">
            요청하신 페이지가 존재하지 않거나, 경로가 잘못되었습니다. 경로를 확인하고 다시 시도해 주세요.
          </p>
        </div>
        <Link href="/" passHref>
          홈으로
        </Link>
      </article>
    </section>
  );
}
