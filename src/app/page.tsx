import Link from "next/link";
import DoorBuilding from "@/components/home/DoorBuilding";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-6 py-14 text-center">
      <h1 className="font-heading text-4xl leading-snug text-[var(--coral-dark)]">
        우리 302호에
        <br />
        놀러올래?
      </h1>
      <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
        문을 열면, 친구들과 함께 채워나갈
        <br />
        우리만의 작은 방이 시작돼요.
        <br />
        성향 테스트부터 편지, 추억까지 —
        <br />
        같이 놀러 온 사람들과 하나씩 완성해가요.
      </p>

      <Link
        href="/new"
        className="sky-card group relative mt-9 flex w-full flex-col items-center overflow-hidden px-6 pb-9 pt-8"
      >
        <div className="w-40 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
          <DoorBuilding />
        </div>
        <span className="btn-primary absolute bottom-3 px-5 py-2.5 text-sm">
          똑똑, 문 열고 들어가기 🚪
        </span>
      </Link>

      <p className="mt-8 text-xs text-[var(--ink-soft)]">
        회원가입 없이, 이름이랑 PIN만으로 바로 시작해요.
      </p>
    </main>
  );
}
