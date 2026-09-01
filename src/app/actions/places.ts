"use server";

import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { getMemberSession } from "@/lib/session";
import { PLACE_DESCRIPTION_MAX_LENGTH, PLACE_NAME_MAX_LENGTH } from "@/lib/places";
import { PHOTO_MAX_BASE64_LENGTH, PHOTO_MIME_PREFIX } from "@/lib/photo";

export type AddPlaceState =
  | { status: "idle" }
  | { status: "error"; error: string };

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function addPlaceAction(
  _prevState: AddPlaceState,
  formData: FormData
): Promise<AddPlaceState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const placeName = String(formData.get("placeName") ?? "").trim();
  const visitedDateRaw = String(formData.get("visitedDate") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const photo = String(formData.get("photo") ?? "").trim();

  if (!slug) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  if (!placeName) {
    return { status: "error", error: "장소 이름을 입력해주세요." };
  }
  if (placeName.length > PLACE_NAME_MAX_LENGTH) {
    return { status: "error", error: `장소 이름은 ${PLACE_NAME_MAX_LENGTH}자 이내로 입력해주세요.` };
  }
  if (description.length > PLACE_DESCRIPTION_MAX_LENGTH) {
    return { status: "error", error: `설명은 ${PLACE_DESCRIPTION_MAX_LENGTH}자 이내로 입력해주세요.` };
  }
  const visitedDate = DATE_REGEX.test(visitedDateRaw) ? visitedDateRaw : null;

  let photoDataUrl: string | null = null;
  if (photo) {
    if (!photo.startsWith(PHOTO_MIME_PREFIX)) {
      return { status: "error", error: "사진 형식이 올바르지 않아요." };
    }
    if (photo.length > PHOTO_MAX_BASE64_LENGTH) {
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
      .collection("places")
      .add({
        authorId: session.memberId,
        authorName: session.name,
        placeName,
        visitedDate,
        description,
        photoDataUrl,
        createdAt: FieldValue.serverTimestamp(),
      });
  } catch (err) {
    console.error("addPlaceAction failed:", err);
    return {
      status: "error",
      error: "저장하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }

  redirect(`/g/${slug}/places`);
}

export type DeletePlaceState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function deletePlaceAction(
  _prevState: DeletePlaceState,
  formData: FormData
): Promise<DeletePlaceState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const placeId = String(formData.get("placeId") ?? "").trim();

  if (!slug || !placeId) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  const session = await getMemberSession(slug);
  if (!session) {
    return { status: "error", error: "로그인이 필요해요." };
  }

  try {
    const db = getDb();
    const ref = db.collection("groups").doc(slug).collection("places").doc(placeId);
    const snap = await ref.get();
    if (!snap.exists) {
      return { status: "idle" };
    }
    if (snap.data()?.authorId !== session.memberId) {
      return { status: "error", error: "내가 남긴 장소만 지울 수 있어요." };
    }
    await ref.delete();
  } catch (err) {
    console.error("deletePlaceAction failed:", err);
    return {
      status: "error",
      error: "삭제하는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
    };
  }

  redirect(`/g/${slug}/places`);
}
