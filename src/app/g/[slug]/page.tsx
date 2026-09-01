import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import { getGroupType, type GroupDoc, type MemberSummary } from "@/lib/group";
import GroupAccessPanel from "@/components/group/GroupAccessPanel";
import InviteSharePanel from "@/components/group/InviteSharePanel";
import MemberList from "@/components/group/MemberList";
import FeatureCardGrid from "@/components/group/FeatureCardGrid";
import EmptyState from "@/components/group/EmptyState";

export default async function GroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { slug } = await params;
  const { welcome } = await searchParams;

  const groupRef = getDb().collection("groups").doc(slug);
  const groupSnap = await groupRef.get();
  if (!groupSnap.exists) {
    notFound();
  }
  const group = groupSnap.data() as GroupDoc;
  const type = getGroupType(group.typeId);

  const session = await getMemberSession(slug);

  const membersSnap = await groupRef
    .collection("members")
    .orderBy("joinedAt", "asc")
    .get();
  const members: MemberSummary[] = membersSnap.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, name: data.name as string, isOwner: data.isOwner as boolean };
  });

  if (!session) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-14">
        <div className="w-full text-center">
          <span className="text-4xl">{group.icon}</span>
          <h1 className="font-heading mt-3 text-3xl text-[var(--ink)]">
            {group.name}
          </h1>
          {group.description && (
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              {group.description}
            </p>
          )}
          <p className="mt-3 text-xs font-bold text-[var(--coral-dark)]">
            {type.emoji} {type.label} 모임 · 멤버 {members.length}명 참여 중
          </p>
        </div>

        <div className="card mt-8 w-full border border-black/5 p-6">
          <p className="mb-4 text-center font-bold text-[var(--ink)]">
            {group.name}에 참여해보세요 {type.emoji}
          </p>
          <GroupAccessPanel slug={slug} members={members} />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <header className="text-center">
        <span className="text-4xl">{group.icon}</span>
        <h1 className="font-heading mt-2 text-3xl text-[var(--ink)]">
          {group.name}
        </h1>
        {group.description && (
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            {group.description}
          </p>
        )}
      </header>

      {welcome === "1" && (
        <div className="mt-6">
          <InviteSharePanel slug={slug} groupName={group.name} />
        </div>
      )}

      <section className="mt-7">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-bold text-[var(--ink)]">
            멤버 {members.length}
            {group.memberTarget ? ` / ${group.memberTarget}` : ""}명
          </p>
        </div>
        {members.length <= 1 ? (
          <EmptyState
            emoji="🥹"
            title="아직 아무도 참여하지 않았어요"
            subtitle="친구들을 초대해보세요."
          />
        ) : (
          <MemberList members={members} currentMemberId={session.memberId} />
        )}
        {welcome !== "1" && (
          <div className="mt-3">
            <InviteSharePanel slug={slug} groupName={group.name} />
          </div>
        )}
      </section>

      <section className="mt-8">
        <p className="mb-2 font-bold text-[var(--ink)]">모임 메뉴</p>
        <FeatureCardGrid />
      </section>
    </main>
  );
}
