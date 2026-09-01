import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import type { GroupDoc, MemberDoc } from "@/lib/group";
import { TRAITS, TRAIT_IDS, type TraitId } from "@/lib/personality";
import EmptyState from "@/components/group/EmptyState";

export default async function RolesPage({
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
    .filter((m) => m.personalityScores) as (MemberDoc & { id: string })[];

  const roleAssignments = TRAIT_IDS.map((id) => {
    const maxScore = Math.max(
      0,
      ...members.map((m) => (m.personalityScores as Record<TraitId, number>)[id] ?? 0)
    );
    if (maxScore <= 0) return null;
    const holders = members
      .filter((m) => (m.personalityScores as Record<TraitId, number>)[id] === maxScore)
      .map((m) => m.name);
    return { id, holders };
  }).filter((r): r is { id: TraitId; holders: string[] } => r !== null);

  const byMember = members.map((m) => {
    const roles = roleAssignments.filter((r) => r.holders.includes(m.name));
    return { name: m.name, roles };
  });

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}/personality`} className="text-sm text-[var(--ink-soft)]">
        ← 성향으로 돌아가기
      </Link>
      <h1 className="font-heading mt-2 text-2xl text-[var(--ink)]">🎉 {group.name}의 역할</h1>

      {members.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            emoji="⏳"
            title="아직 역할을 볼 수 없어요"
            subtitle="성향 테스트를 마치면 역할이 정해져요."
          />
          <Link href={`/g/${slug}/personality`} className="btn-primary mt-4 flex w-full justify-center py-3">
            성향 테스트 하러 가기
          </Link>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          <section className="grid grid-cols-2 gap-3">
            {roleAssignments.map((r) => (
              <div key={r.id} className="card animate-fade-in-up border border-black/5 p-4">
                <p className="text-2xl">{TRAITS[r.id].emoji}</p>
                <p className="mt-1 text-sm font-bold text-[var(--ink)]">
                  {TRAITS[r.id].roleLabel}
                </p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  {r.holders.join(", ")}
                </p>
              </div>
            ))}
          </section>

          <section>
            <p className="mb-2 text-sm font-bold text-[var(--ink)]">멤버별 역할</p>
            <div className="flex flex-col gap-2">
              {byMember.map((m) => (
                <div
                  key={m.name}
                  className="card flex items-center justify-between border border-black/5 px-4 py-3"
                >
                  <span className="font-bold text-[var(--ink)]">{m.name}</span>
                  <span className="text-sm">
                    {m.roles.length > 0
                      ? m.roles.map((r) => TRAITS[r.id].emoji).join(" ")
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
