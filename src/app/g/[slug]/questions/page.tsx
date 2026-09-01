import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import type { GroupDoc, MemberSummary } from "@/lib/group";
import { QUESTIONS } from "@/lib/questions";
import { getInitialTally } from "@/app/actions/questions";
import QuestionVoteCard from "@/components/group/QuestionVoteCard";

export default async function QuestionsPage({
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
  const members: MemberSummary[] = membersSnap.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, name: data.name as string, isOwner: data.isOwner as boolean };
  });
  const otherMembers = members.filter((m) => m.id !== session.memberId);

  const initials = await Promise.all(
    QUESTIONS.map((q) => getInitialTally(slug, q.id))
  );

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}`} className="text-sm text-[var(--ink-soft)]">
        ← {group.name}으로 돌아가기
      </Link>
      <h1 className="font-heading mt-2 text-2xl text-[var(--ink)]">
        👀 {group.name}이 생각하는 사람
      </h1>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">
        투표는 익명이에요. 누가 누구를 뽑았는지는 아무도 볼 수 없어요.
      </p>

      {otherMembers.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--ink-soft)]">
          친구들이 참여하면 질문에 투표할 수 있어요.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {QUESTIONS.map((q, i) => (
            <QuestionVoteCard
              key={q.id}
              slug={slug}
              questionId={q.id}
              emoji={q.emoji}
              text={q.text}
              members={otherMembers}
              initialMyTargetId={initials[i].myTargetId}
              initialTally={initials[i].tally}
            />
          ))}
        </div>
      )}
    </main>
  );
}
