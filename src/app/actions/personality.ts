"use server";

import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import { dominantTrait, isValidAnswerSet, scoreAnswers } from "@/lib/personality";

export type SubmitPersonalityState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function submitPersonalityAction(
  _prevState: SubmitPersonalityState,
  formData: FormData
): Promise<SubmitPersonalityState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const answers = String(formData.get("answers") ?? "").split(",");

  if (!slug) {
    return { status: "error", error: "잘못된 요청입니다." };
  }

  const session = await getMemberSession(slug);
  if (!session) {
    return { status: "error", error: "로그인이 필요해요. 다시 들어와주세요." };
  }
  if (!isValidAnswerSet(answers)) {
    return { status: "error", error: "모든 질문에 답해주세요." };
  }

  try {
    const scores = scoreAnswers(answers);
    const typeId = dominantTrait(scores);
    const memberRef = getDb()
      .collection("groups")
      .doc(slug)
      .collection("members")
      .doc(session.memberId);

    await memberRef.update({
      personalityAnswers: answers,
      personalityScores: scores,
      personalityTypeId: typeId,
      personalityCompletedAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("submitPersonalityAction failed:", err);
    return {
      status: "error",
      error: "저장하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }

  redirect(`/g/${slug}/personality`);
}
