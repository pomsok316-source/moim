"use server";

import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import { LETTER_MESSAGE_MAX_LENGTH, getLetterPrompt, type LetterPromptId } from "@/lib/letters";

export type SendLetterState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function sendLetterAction(
  _prevState: SendLetterState,
  formData: FormData
): Promise<SendLetterState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const recipientId = String(formData.get("recipientId") ?? "").trim();
  const promptIdRaw = String(formData.get("promptId") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!slug || !recipientId) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  if (!message) {
    return { status: "error", error: "편지 내용을 입력해주세요." };
  }
  if (message.length > LETTER_MESSAGE_MAX_LENGTH) {
    return {
      status: "error",
      error: `편지는 ${LETTER_MESSAGE_MAX_LENGTH}자 이내로 적어주세요.`,
    };
  }

  const session = await getMemberSession(slug);
  if (!session) {
    return { status: "error", error: "로그인이 필요해요." };
  }
  if (recipientId === session.memberId) {
    return { status: "error", error: "나에게는 편지를 보낼 수 없어요." };
  }

  try {
    const db = getDb();
    const groupRef = db.collection("groups").doc(slug);
    const recipientSnap = await groupRef.collection("members").doc(recipientId).get();
    if (!recipientSnap.exists) {
      return { status: "error", error: "존재하지 않는 멤버예요." };
    }

    const prompt = getLetterPrompt(promptIdRaw);
    const recipientName = recipientSnap.data()?.name as string;

    await groupRef.collection("letters").add({
      senderId: session.memberId,
      senderName: session.name,
      recipientId,
      recipientName,
      promptId: (prompt?.id as LetterPromptId | undefined) ?? null,
      promptLabel: prompt ? prompt.label(recipientName) : null,
      message,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("sendLetterAction failed:", err);
    return {
      status: "error",
      error: "편지를 보내는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }

  redirect(`/g/${slug}/letters?sent=1`);
}

export type DeleteLetterState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function deleteLetterAction(
  _prevState: DeleteLetterState,
  formData: FormData
): Promise<DeleteLetterState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const letterId = String(formData.get("letterId") ?? "").trim();

  if (!slug || !letterId) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  const session = await getMemberSession(slug);
  if (!session) {
    return { status: "error", error: "로그인이 필요해요." };
  }

  try {
    const db = getDb();
    const letterRef = db.collection("groups").doc(slug).collection("letters").doc(letterId);
    const snap = await letterRef.get();
    if (!snap.exists) {
      return { status: "idle" };
    }
    if (snap.data()?.senderId !== session.memberId) {
      return { status: "error", error: "내가 보낸 편지만 지울 수 있어요." };
    }
    await letterRef.delete();
  } catch (err) {
    console.error("deleteLetterAction failed:", err);
    return {
      status: "error",
      error: "삭제하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }

  redirect(`/g/${slug}/letters?tab=sent`);
}
