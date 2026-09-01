import "server-only";
import { cache } from "react";
import { getDb } from "./firebaseAdmin";
import type { GroupDoc, MemberDoc } from "./group";
import {
  TRAIT_IDS,
  emptyScores,
  dominantTrait,
  computeCompatibilityPercent,
  type TraitId,
} from "./personality";
import { QUESTIONS } from "./questions";

export type GroupReport = {
  groupName: string;
  groupIcon: string;
  daysTogether: number;
  memberCount: number;
  groupTypeId: TraitId | null;
  moodBreakdown: { id: TraitId; percent: number }[];
  bestChemistry: { aName: string; bName: string; percent: number } | null;
  mostMentioned: { name: string; count: number } | null;
  mostVisitedPlace: { name: string; count: number } | null;
  letterCount: number;
  memoryCount: number;
  placeCount: number;
};

export const computeGroupReport = cache(async (slug: string): Promise<GroupReport | null> => {
  const db = getDb();
  const groupRef = db.collection("groups").doc(slug);
  const groupSnap = await groupRef.get();
  if (!groupSnap.exists) return null;
  const group = groupSnap.data() as GroupDoc;

  const [membersSnap, lettersSnap, memoriesCountSnap, placesSnap, voteEntries] =
    await Promise.all([
      groupRef.collection("members").get(),
      groupRef.collection("letters").get(),
      groupRef.collection("memories").count().get(),
      groupRef.collection("places").get(),
      Promise.all(
        QUESTIONS.map((q) =>
          groupRef.collection("questionVotes").doc(q.id).collection("entries").get()
        )
      ),
    ]);

  const members = membersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as MemberDoc) }));
  const nameById = new Map(members.map((m) => [m.id, m.name]));

  const daysTogether = group.createdAt
    ? Math.max(1, Math.ceil((Date.now() - group.createdAt.toMillis()) / 86_400_000))
    : 1;

  // --- 성향 기반: 모임 유형 / 분위기 / 최고의 케미 ---
  const completed = members.filter((m) => m.personalityTypeId && m.personalityScores);
  let groupTypeId: TraitId | null = null;
  let moodBreakdown: { id: TraitId; percent: number }[] = [];
  let bestChemistry: GroupReport["bestChemistry"] = null;

  if (completed.length > 0) {
    const total = completed.reduce((acc, m) => {
      const scores = m.personalityScores as Record<TraitId, number>;
      for (const id of TRAIT_IDS) acc[id] += scores[id] ?? 0;
      return acc;
    }, emptyScores());
    groupTypeId = dominantTrait(total);

    const top4 = [...TRAIT_IDS].sort((a, b) => total[b] - total[a]).slice(0, 4);
    const sumTop4 = top4.reduce((s, id) => s + total[id], 0) || 1;
    let used = 0;
    moodBreakdown = top4.map((id, i) => {
      if (i === top4.length - 1) {
        return { id, percent: 100 - used };
      }
      const pct = Math.round((total[id] / sumTop4) * 100);
      used += pct;
      return { id, percent: pct };
    });
  }

  if (completed.length >= 2) {
    let best = { aName: "", bName: "", percent: -1 };
    for (let i = 0; i < completed.length; i++) {
      for (let j = i + 1; j < completed.length; j++) {
        const percent = computeCompatibilityPercent(
          completed[i].personalityScores as Record<TraitId, number>,
          completed[j].personalityScores as Record<TraitId, number>
        );
        if (percent > best.percent) {
          best = { aName: completed[i].name, bName: completed[j].name, percent };
        }
      }
    }
    bestChemistry = best.percent >= 0 ? best : null;
  }

  // --- 가장 많이 언급된 사람: 받은 편지 + 질문 투표 합산 ---
  const mentionCounts = new Map<string, number>();
  lettersSnap.docs.forEach((d) => {
    const recipientId = d.data().recipientId as string;
    mentionCounts.set(recipientId, (mentionCounts.get(recipientId) ?? 0) + 1);
  });
  voteEntries.flat().forEach((entriesSnap) => {
    entriesSnap.docs.forEach((d) => {
      const targetId = d.data().targetId as string;
      mentionCounts.set(targetId, (mentionCounts.get(targetId) ?? 0) + 1);
    });
  });
  let mostMentioned: GroupReport["mostMentioned"] = null;
  for (const [id, count] of mentionCounts) {
    if (!mostMentioned || count > mostMentioned.count) {
      const name = nameById.get(id);
      if (name) mostMentioned = { name, count };
    }
  }

  // --- 가장 많이 등장한 장소 ---
  const placeCounts = new Map<string, number>();
  placesSnap.docs.forEach((d) => {
    const name = d.data().placeName as string;
    placeCounts.set(name, (placeCounts.get(name) ?? 0) + 1);
  });
  let mostVisitedPlace: GroupReport["mostVisitedPlace"] = null;
  for (const [name, count] of placeCounts) {
    if (!mostVisitedPlace || count > mostVisitedPlace.count) {
      mostVisitedPlace = { name, count };
    }
  }

  return {
    groupName: group.name,
    groupIcon: group.icon,
    daysTogether,
    memberCount: members.length,
    groupTypeId,
    moodBreakdown,
    bestChemistry,
    mostMentioned,
    mostVisitedPlace,
    letterCount: lettersSnap.size,
    memoryCount: memoriesCountSnap.data().count,
    placeCount: placesSnap.size,
  };
});

