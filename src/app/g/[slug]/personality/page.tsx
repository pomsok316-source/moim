import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import type { GroupDoc, MemberDoc } from "@/lib/group";
import {
  TRAITS,
  emptyScores,
  topTraits,
  dominantTrait,
  type TraitId,
} from "@/lib/personality";
import PersonalityQuiz from "@/components/personality/PersonalityQuiz";
import TraitCard from "@/components/personality/TraitCard";
import EmptyState from "@/components/group/EmptyState";

export default async function PersonalityPage({
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
  const members = membersSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as MemberDoc),
  }));

  const me = members.find((m) => m.id === session.memberId);
  const completed = members.filter((m) => m.personalityTypeId);

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}`} className="text-sm text-[var(--ink-soft)]">
        ← {group.name}으로 돌아가기
      </Link>
      <h1 className="font-heading mt-2 text-2xl text-[var(--ink)]">
        🎭 우리들의 성향
      </h1>

      {!me?.personalityTypeId ? (
        <div className="card mt-5 border border-black/5 p-5">
          <PersonalityQuiz slug={slug} />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          <TraitCard
            eyebrow="나의 성향"
            emoji={TRAITS[me.personalityTypeId as TraitId].emoji}
            title={TRAITS[me.personalityTypeId as TraitId].personalTitle}
            desc={TRAITS[me.personalityTypeId as TraitId].personalDesc}
          />

          <section>
            <p className="mb-2 text-sm font-bold text-[var(--ink)]">
              성향 테스트 {completed.length} / {members.length}명 완료
            </p>

            {completed.length < 2 ? (
              <EmptyState
                emoji="⏳"
                title="아직 다 같이 안 했어요"
                subtitle="친구들이 테스트를 마치면 모임 전체 성향이 열려요."
              />
            ) : (
              (() => {
                const total = completed.reduce((acc, m) => {
                  const scores = (m.personalityScores ?? emptyScores()) as Record<
                    TraitId,
                    number
                  >;
                  for (const id of Object.keys(scores) as TraitId[]) {
                    acc[id] = (acc[id] ?? 0) + scores[id];
                  }
                  return acc;
                }, emptyScores());
                const groupTypeId = dominantTrait(total);
                const bullets = topTraits(total, 4);

                return (
                  <div className="flex flex-col gap-4">
                    <TraitCard
                      tone="sky"
                      eyebrow={`${group.name}의 성향`}
                      emoji={TRAITS[groupTypeId].emoji}
                      title={TRAITS[groupTypeId].groupTitle}
                      desc={TRAITS[groupTypeId].groupDesc}
                    />
                    <div className="card flex flex-col gap-2 border border-black/5 p-4">
                      {bullets.map((id) => (
                        <p key={id} className="text-sm text-[var(--ink)]">
                          {TRAITS[id].emoji} {TRAITS[id].bullet}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </section>

          <section className="grid grid-cols-2 gap-3">
            <Link
              href={`/g/${slug}/compatibility`}
              className="card flex flex-col items-center gap-1 border border-black/5 py-5"
            >
              <span className="text-2xl">❤️</span>
              <span className="text-sm font-bold text-[var(--ink)]">우리 궁합</span>
            </Link>
            <Link
              href={`/g/${slug}/roles`}
              className="card flex flex-col items-center gap-1 border border-black/5 py-5"
            >
              <span className="text-2xl">🎉</span>
              <span className="text-sm font-bold text-[var(--ink)]">우리들의 역할</span>
            </Link>
          </section>
        </div>
      )}
    </main>
  );
}
