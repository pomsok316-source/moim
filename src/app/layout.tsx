import type { Metadata } from "next";
import { Jua, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const heading = Jua({
  variable: "--font-heading",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const body = Noto_Sans_KR({
  variable: "--font-body",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "모임",
  description:
    "친구, 커플, 가족, 동아리 — 우리끼리만 하는 성향 테스트와 궁합, 편지, 추억 기록.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${heading.variable} ${body.variable} h-full`}>
      <body className="relative min-h-full">{children}</body>
    </html>
  );
}
