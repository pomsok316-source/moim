import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-4xl">🔎🧸</p>
      <h1 className="font-heading mt-3 text-3xl text-[var(--ink)]">
        존재하지 않는 모임이에요
      </h1>
      <p className="mt-2 text-[var(--ink-soft)]">
        링크를 다시 확인해주세요.
      </p>
      <Link href="/" className="btn-primary mt-8 px-6 py-3">
        홈으로 돌아가기
      </Link>
    </main>
  );
}
