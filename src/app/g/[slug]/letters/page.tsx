import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import type { GroupDoc, MemberSummary } from "@/lib/group";
import type { LetterDoc } from "@/lib/letters";
import LettersHub, { type LetterView } from "@/components/group/LettersHub";

function formatDate(ts: FirebaseFirestore.Timestamp | null | undefined): string {
  if (!ts) return "";
  return ts.toDate().toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export default async function LettersPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string; tab?: string }>;
}) {
  const { slug } = await params;
  const { sent: justSentParam, tab: tabParam } = await searchParams;

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

  const [membersSnap, receivedSnap, sentSnap] = await Promise.all([
    groupRef.collection("members").orderBy("joinedAt", "asc").get(),
    groupRef.collection("letters").where("recipientId", "==", session.memberId).get(),
    groupRef.collection("letters").where("senderId", "==", session.memberId).get(),
  ]);

  const members: MemberSummary[] = membersSnap.docs
    .map((doc) => {
      const data = doc.data();
      return { id: doc.id, name: data.name as string, isOwner: data.isOwner as boolean };
    })
    .filter((m) => m.id !== session.memberId);

  const toView = (doc: FirebaseFirestore.QueryDocumentSnapshot): LetterView => {
    const d = doc.data() as LetterDoc;
    return {
      id: doc.id,
      senderName: d.senderName,
      recipientName: d.recipientName,
      promptLabel: d.promptLabel,
      message: d.message,
      createdAtLabel: formatDate(d.createdAt),
    };
  };

  const sortByDateDesc = (a: FirebaseFirestore.QueryDocumentSnapshot, b: FirebaseFirestore.QueryDocumentSnapshot) => {
    const ta = (a.data().createdAt as FirebaseFirestore.Timestamp | null)?.toMillis() ?? 0;
    const tb = (b.data().createdAt as FirebaseFirestore.Timestamp | null)?.toMillis() ?? 0;
    return tb - ta;
  };

  const received = receivedSnap.docs.sort(sortByDateDesc).map(toView);
  const sent = sentSnap.docs.sort(sortByDateDesc).map(toView);

  const initialTab = tabParam === "sent" ? "sent" : justSentParam === "1" ? "sent" : "inbox";

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}`} className="text-sm text-[var(--ink-soft)]">
        ← {group.name}으로 돌아가기
      </Link>
      <h1 className="font-heading mt-2 text-2xl text-[var(--ink)]">
        💌 {group.name}에게 온 편지
      </h1>

      <div className="mt-5">
        <LettersHub
          slug={slug}
          members={members}
          received={received}
          sent={sent}
          initialTab={initialTab}
          justSent={justSentParam === "1"}
        />
      </div>
    </main>
  );
}
