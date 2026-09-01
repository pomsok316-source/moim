import Link from "next/link";

const PREVIEW_CARDS = [
  { emoji: "🎭", label: "우리들의 성향" },
  { emoji: "❤️", label: "우리 궁합" },
  { emoji: "👀", label: "서로의 생각" },
  { emoji: "💌", label: "우리에게 온 편지" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-6 py-14 text-center">
      <p className="animate-bob text-5xl">🧸</p>
      <h1 className="font-heading mt-4 text-5xl text-[var(--coral-dark)]">
        모임
      </h1>
      <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
        친구, 커플, 가족, 동아리, 회사 동료까지 —
        <br />
        링크 하나로 모여서
        <br />
        <span className="font-bold text-[var(--ink)]">
          우리만의 성향, 궁합, 편지, 추억
        </span>
        을
        <br />
        함께 만들어보세요.
      </p>

      <div className="mt-8 grid w-full grid-cols-2 gap-3">
        {PREVIEW_CARDS.map((c, i) => (
          <div
            key={c.label}
            className="card animate-fade-in-up flex flex-col items-center gap-1 px-3 py-5"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="text-2xl">{c.emoji}</span>
            <span className="text-sm font-bold text-[var(--ink)]">
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/new"
        className="btn-primary mt-10 flex w-full items-center justify-center py-4 text-lg"
      >
        우리 모임 만들기 🎉
      </Link>

      <p className="mt-6 text-xs text-[var(--ink-soft)]">
        회원가입 없이, 링크 하나로 바로 시작해요.
      </p>
    </main>
  );
}
