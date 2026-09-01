import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import type { GroupDoc } from "@/lib/group";
import type { MemoryDoc } from "@/lib/memories";
import MemoriesHub, { type MemoryView } from "@/components/group/MemoriesHub";

function formatDate(ts: FirebaseFirestore.Timestamp | null | undefined): string {
  if (!ts) return "";
  return ts.toDate().toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

export default async function MemoriesPage({
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

  const memoriesSnap = await groupRef.collection("memories").get();
  const memories: MemoryView[] = memoriesSnap.docs
    .sort((a, b) => {
      const ta = (a.data().createdAt as FirebaseFirestore.Timestamp | null)?.toMillis() ?? 0;
      const tb = (b.data().createdAt as FirebaseFirestore.Timestamp | null)?.toMillis() ?? 0;
      return tb - ta;
    })
    .map((doc) => {
      const d = doc.data() as MemoryDoc;
      return {
        id: doc.id,
        authorId: d.authorId,
        authorName: d.authorName,
        text: d.text,
        photoDataUrl: d.photoDataUrl,
        createdAtLabel: formatDate(d.createdAt),
      };
    });

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}`} className="text-sm text-[var(--ink-soft)]">
        ← {group.name}으로 돌아가기
      </Link>
      <h1 className="font-heading mt-2 text-2xl text-[var(--ink)]">
        📖 {group.name}의 이야기
      </h1>

      <div className="mt-5">
        <MemoriesHub slug={slug} memories={memories} currentMemberId={session.memberId} />
      </div>
    </main>
  );
}
