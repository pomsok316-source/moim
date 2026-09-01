"use server";

import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import { getQuestion } from "@/lib/questions";

export type TallyEntry = { memberId: string; name: string; count: number };

export type VoteState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | { status: "success"; myTargetId: string; tally: TallyEntry[] };

async function computeTally(
  slug: string,
  questionId: string
): Promise<{ tally: TallyEntry[]; myTargetId: string | null }> {
  const db = getDb();
  const groupRef = db.collection("groups").doc(slug);

  const [entriesSnap, membersSnap, session] = await Promise.all([
    groupRef.collection("questionVotes").doc(questionId).collection("entries").get(),
    groupRef.collection("members").get(),
    getMemberSession(slug),
  ]);

  const nameById = new Map<string, string>();
  membersSnap.docs.forEach((d) => nameById.set(d.id, (d.data().name as string) ?? "?"));

  const counts = new Map<string, number>();
  let myTargetId: string | null = null;
  entriesSnap.docs.forEach((d) => {
    const targetId = d.data().targetId as string;
    counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
    if (session && d.id === session.memberId) {
      myTargetId = targetId;
    }
  });

  const tally: TallyEntry[] = [...counts.entries()]
    .map(([memberId, count]) => ({
      memberId,
      name: nameById.get(memberId) ?? "?",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return { tally, myTargetId };
}

export async function getInitialTally(slug: string, questionId: string) {
  return computeTally(slug, questionId);
}

export async function voteAction(
  _prevState: VoteState,
  formData: FormData
): Promise<VoteState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const questionId = String(formData.get("questionId") ?? "").trim();
  const targetId = String(formData.get("targetId") ?? "").trim();

  if (!slug || !getQuestion(questionId) || !targetId) {
    return { status: "error", error: "잘못된 요청입니다." };
  }

  const session = await getMemberSession(slug);
  if (!session) {
    return { status: "error", error: "로그인이 필요해요." };
  }
  if (targetId === session.memberId) {
    return { status: "error", error: "본인은 선택할 수 없어요." };
  }

  try {
    const db = getDb();
    const groupRef = db.collection("groups").doc(slug);
    const targetSnap = await groupRef.collection("members").doc(targetId).get();
    if (!targetSnap.exists) {
      return { status: "error", error: "존재하지 않는 멤버예요." };
    }

    await groupRef
      .collection("questionVotes")
      .doc(questionId)
      .collection("entries")
      .doc(session.memberId)
      .set({ targetId, createdAt: FieldValue.serverTimestamp() });

    const { tally } = await computeTally(slug, questionId);
    return { status: "success", myTargetId: targetId, tally };
  } catch (err) {
    console.error("voteAction failed:", err);
    return {
      status: "error",
      error: "투표하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }
}
