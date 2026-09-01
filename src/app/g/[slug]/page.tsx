import { notFound } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import { getGroupType, type GroupDoc, type MemberSummary } from "@/lib/group";
import type { TraitId } from "@/lib/personality";
import GroupAccessPanel from "@/components/group/GroupAccessPanel";
import InviteSharePanel from "@/components/group/InviteSharePanel";
import RoomScene, { type RoomMember } from "@/components/group/RoomScene";

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

  const membersSnap = await groupRef.collection("members").orderBy("joinedAt", "asc").get();
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

  const [roomMembersSnap, letterCountSnap, memoryCountSnap, placeCountSnap] = await Promise.all([
    groupRef.collection("members").orderBy("joinedAt", "asc").get(),
    groupRef.collection("letters").count().get(),
    groupRef.collection("memories").count().get(),
    groupRef.collection("places").count().get(),
  ]);
  const roomMembers: RoomMember[] = roomMembersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name as string,
      personalityTypeId: (data.personalityTypeId as TraitId | undefined) ?? null,
    };
  });

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 py-6">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{group.icon}</span>
          <div>
            <h1 className="font-heading text-xl leading-none text-[var(--ink)]">
              {group.name}
            </h1>
            <p className="text-xs text-[var(--ink-soft)]">멤버 {members.length}명</p>
          </div>
        </div>
      </header>

      {welcome === "1" && (
        <div className="mt-4">
          <InviteSharePanel slug={slug} groupName={group.name} />
        </div>
      )}

      <section className="mt-4">
        <RoomScene
          slug={slug}
          members={roomMembers}
          letterCount={letterCountSnap.data().count}
          memoryCount={memoryCountSnap.data().count}
          placeCount={placeCountSnap.data().count}
        />
      </section>

      {welcome !== "1" && (
        <div className="mt-4">
          <InviteSharePanel slug={slug} groupName={group.name} />
        </div>
      )}
    </main>
  );
}
