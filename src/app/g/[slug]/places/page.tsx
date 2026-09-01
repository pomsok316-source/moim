import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import type { GroupDoc } from "@/lib/group";
import type { PlaceDoc } from "@/lib/places";
import PlacesHub, { type PlaceView } from "@/components/group/PlacesHub";

function formatVisitedDate(value: string | null): string | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

export default async function PlacesPage({
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

  const placesSnap = await groupRef.collection("places").get();
  const places: PlaceView[] = placesSnap.docs
    .sort((a, b) => {
      const ta = (a.data().createdAt as FirebaseFirestore.Timestamp | null)?.toMillis() ?? 0;
      const tb = (b.data().createdAt as FirebaseFirestore.Timestamp | null)?.toMillis() ?? 0;
      return tb - ta;
    })
    .map((doc) => {
      const d = doc.data() as PlaceDoc;
      return {
        id: doc.id,
        authorId: d.authorId,
        authorName: d.authorName,
        placeName: d.placeName,
        visitedDateLabel: formatVisitedDate(d.visitedDate),
        description: d.description,
        photoDataUrl: d.photoDataUrl,
      };
    });

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}`} className="text-sm text-[var(--ink-soft)]">
        ← {group.name}으로 돌아가기
      </Link>
      <h1 className="font-heading mt-2 text-2xl text-[var(--ink)]">
        🌏 {group.name}이 함께한 곳
      </h1>

      <div className="mt-5">
        <PlacesHub slug={slug} places={places} currentMemberId={session.memberId} />
      </div>
    </main>
  );
}
