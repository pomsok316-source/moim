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
  title: "302호",
  description:
    "똑똑, 문 열어도 돼? 친구, 커플, 가족과 함께 채워가는 우리만의 작은 방.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${heading.variable} ${body.variable} h-full`}>
      <body className="relative min-h-full">{children}</body>
    </html>
  );
}
