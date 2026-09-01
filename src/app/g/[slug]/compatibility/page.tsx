import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import type { GroupDoc, MemberDoc } from "@/lib/group";
import {
  computeCompatibilityPercent,
  compatibilityReason,
  type TraitId,
} from "@/lib/personality";
import EmptyState from "@/components/group/EmptyState";
import ShareButton from "@/components/group/ShareButton";

type Pair = {
  a: { id: string; name: string };
  b: { id: string; name: string };
  percent: number;
  reason: string;
  spontaneousOverlap: number;
  talkOverlap: number;
};

export default async function CompatibilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const groupRef = getDb().collection("groups").doc(slug);
  const groupSnap = await groupRef.get();
  if (!groupSnap.exists) {
    notFound();
  }
  const group = groupSnap.data() as GroupDoc;

  const session = await getMemberSession(slug);
  if (!session) {
    redirect(`/g/${slug}`);
  }

  const membersSnap = await groupRef.collection("members").orderBy("joinedAt", "asc").get();
  const members = membersSnap.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() as MemberDoc) }))
    .filter((m) => m.personalityTypeId && m.personalityScores);

  const pairs: Pair[] = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i];
      const b = members[j];
      const sa = a.personalityScores as Record<TraitId, number>;
      const sb = b.personalityScores as Record<TraitId, number>;
      pairs.push({
        a: { id: a.id, name: a.name },
        b: { id: b.id, name: b.name },
        percent: computeCompatibilityPercent(sa, sb),
        reason: compatibilityReason(sa, sb),
        spontaneousOverlap: Math.min(sa.spontaneous, sb.spontaneous),
        talkOverlap: Math.min(sa.mood, sb.mood) + Math.min(sa.sentimental, sb.sentimental),
      });
    }
  }

  const bestChemistry = [...pairs].sort((x, y) => y.percent - x.percent)[0];
  const bestTravel = [...pairs].sort(
    (x, y) => y.spontaneousOverlap - x.spontaneousOverlap
  )[0];
  const bestTalk = [...pairs].sort((x, y) => y.talkOverlap - x.talkOverlap)[0];

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}/personality`} className="text-sm text-[var(--ink-soft)]">
        ← 성향으로 돌아가기
      </Link>
      <h1 className="font-heading mt-2 text-2xl text-[var(--ink)]">❤️ {group.name}의 궁합</h1>

      {pairs.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            emoji="⏳"
            title="아직 궁합을 볼 수 없어요"
            subtitle="멤버 2명 이상이 성향 테스트를 마치면 궁합이 열려요."
          />
          <Link href={`/g/${slug}/personality`} className="btn-primary mt-4 flex w-full justify-center py-3">
            성향 테스트 하러 가기
          </Link>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {pairs.length >= 3 && (
            <section className="flex flex-col gap-3">
              <div className="card animate-pop-in border border-black/5 p-4">
                <p className="text-xs font-bold text-[var(--coral-dark)]">🏆 최고의 케미</p>
                <p className="mt-1 font-heading text-lg text-[var(--ink)]">
                  {bestChemistry.a.name} × {bestChemistry.b.name}
                </p>
                <p className="text-2xl font-bold text-[var(--coral-dark)]">
                  {bestChemistry.percent}%
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="card border border-black/5 p-4">
                  <p className="text-xs font-bold text-[var(--ink-soft)]">✈️ 여행 조합</p>
                  <p className="mt-1 text-sm font-bold text-[var(--ink)]">
                    {bestTravel.a.name} × {bestTravel.b.name}
                  </p>
                  <p className="text-lg font-bold text-[var(--coral-dark)]">
                    {bestTravel.percent}%
                  </p>
                </div>
                <div className="card border border-black/5 p-4">
                  <p className="text-xs font-bold text-[var(--ink-soft)]">💬 대화 조합</p>
                  <p className="mt-1 text-sm font-bold text-[var(--ink)]">
                    {bestTalk.a.name} × {bestTalk.b.name}
                  </p>
                  <p className="text-lg font-bold text-[var(--coral-dark)]">
                    {bestTalk.percent}%
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <p className="text-sm font-bold text-[var(--ink)]">모든 궁합</p>
            {pairs
              .sort((x, y) => y.percent - x.percent)
              .map((p) => (
                <div
                  key={`${p.a.id}-${p.b.id}`}
                  className="card border border-black/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[var(--ink)]">
                      {p.a.name} × {p.b.name}
                    </p>
                    <p className="text-lg font-bold text-[var(--coral-dark)]">
                      ❤️ {p.percent}%
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">{p.reason}</p>
                </div>
              ))}
          </section>

          <ShareButton
            path={`/g/${slug}/compatibility`}
            shareTitle={`${group.name}의 궁합 결과 ✨`}
            shareText={`${group.name}에서 우리 궁합을 확인해보세요 ❤️`}
            copyLabel="궁합 링크 복사"
          />
        </div>
      )}
    </main>
  );
}
