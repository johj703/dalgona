import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProviders from "@/hooks/useReactQuery";
import dynamic from "next/dynamic";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "달고나",
  description: "달별로 모아보는 고즈넉한 나의 일기"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ToastContainer = dynamic(() => import("@/components/GetToast"), { ssr: false });

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastContainer />
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
