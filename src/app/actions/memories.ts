"use server";

import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import {
  MEMORY_IMAGE_MAX_BASE64_LENGTH,
  MEMORY_IMAGE_MIME_PREFIX,
  MEMORY_TEXT_MAX_LENGTH,
} from "@/lib/memories";

export type AddMemoryState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function addMemoryAction(
  _prevState: AddMemoryState,
  formData: FormData
): Promise<AddMemoryState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const photo = String(formData.get("photo") ?? "").trim();

  if (!slug) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  if (!text) {
    return { status: "error", error: "이야기를 적어주세요." };
  }
  if (text.length > MEMORY_TEXT_MAX_LENGTH) {
    return {
      status: "error",
      error: `이야기는 ${MEMORY_TEXT_MAX_LENGTH}자 이내로 적어주세요.`,
    };
  }
  let photoDataUrl: string | null = null;
  if (photo) {
    if (!photo.startsWith(MEMORY_IMAGE_MIME_PREFIX)) {
      return { status: "error", error: "사진 형식이 올바르지 않아요." };
    }
    if (photo.length > MEMORY_IMAGE_MAX_BASE64_LENGTH) {
      return { status: "error", error: "사진 용량이 너무 커요. 다른 사진을 선택해주세요." };
    }
    photoDataUrl = photo;
  }

  const session = await getMemberSession(slug);
  if (!session) {
    return { status: "error", error: "로그인이 필요해요." };
  }

  try {
    const db = getDb();
    await db
      .collection("groups")
      .doc(slug)
      .collection("memories")
      .add({
        authorId: session.memberId,
        authorName: session.name,
        text,
        photoDataUrl,
        createdAt: FieldValue.serverTimestamp(),
      });
  } catch (err) {
    console.error("addMemoryAction failed:", err);
    return {
      status: "error",
      error: "저장하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }

  redirect(`/g/${slug}/memories`);
}

export type DeleteMemoryState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function deleteMemoryAction(
  _prevState: DeleteMemoryState,
  formData: FormData
): Promise<DeleteMemoryState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const memoryId = String(formData.get("memoryId") ?? "").trim();

  if (!slug || !memoryId) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  const session = await getMemberSession(slug);
  if (!session) {
    return { status: "error", error: "로그인이 필요해요." };
  }

  try {
    const db = getDb();
    const ref = db.collection("groups").doc(slug).collection("memories").doc(memoryId);
    const snap = await ref.get();
    if (!snap.exists) {
      return { status: "idle" };
    }
    if (snap.data()?.authorId !== session.memberId) {
      return { status: "error", error: "내가 남긴 이야기만 지울 수 있어요." };
    }
    await ref.delete();
  } catch (err) {
    console.error("deleteMemoryAction failed:", err);
    return {
      status: "error",
      error: "삭제하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }

  redirect(`/g/${slug}/memories`);
}
