"use server";

import { customAlphabet } from "nanoid";
import { redirect } from "next/navigation";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebaseAdmin";
import { setMemberSessionCookie } from "@/lib/session";
import { hashPin, verifyPin } from "@/lib/pin";
import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_ICONS,
  GROUP_NAME_MAX_LENGTH,
  GROUP_TYPES,
  MAX_PIN_ATTEMPTS,
  MAX_SESSION_TOKENS,
  MEMBER_NAME_MAX_LENGTH,
  MEMBER_TARGET_MAX,
  MEMBER_TARGET_MIN,
  PIN_LOCK_MS,
  PIN_REGEX,
  SLUG_ALPHABET,
  SLUG_LENGTH,
  TOKEN_ALPHABET,
  TOKEN_LENGTH,
  type GroupDoc,
  type GroupTypeId,
  type MemberDoc,
} from "@/lib/group";

const generateSlug = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH);
const generateToken = customAlphabet(TOKEN_ALPHABET, TOKEN_LENGTH);

function validatePin(pin: string, pinConfirm: string): string | null {
  if (!PIN_REGEX.test(pin)) return "PIN은 숫자 4자리로 입력해주세요.";
  if (pin !== pinConfirm) return "PIN이 서로 일치하지 않아요.";
  return null;
}

// 같은 모임 안에서 이름이 겹치면 "기존 이름으로 로그인"할 때 헷갈리므로 대소문자 무시하고 유일해야 한다.
async function isNameTaken(
  membersRef: CollectionReference,
  nameLower: string
): Promise<boolean> {
  const snap = await membersRef.where("nameLower", "==", nameLower).limit(1).get();
  return !snap.empty;
}

async function createMemberAndSignIn(
  slug: string,
  groupRef: DocumentReference,
  params: { name: string; pin: string; isOwner: boolean }
) {
  const memberRef = groupRef.collection("members").doc();
  const { hash, salt } = hashPin(params.pin);
  const token = generateToken();

  const memberDoc: Omit<MemberDoc, "joinedAt" | "pinLockedUntil"> = {
    name: params.name,
    nameLower: params.name.toLowerCase(),
    pinHash: hash,
    pinSalt: salt,
    sessionTokens: [token],
    isOwner: params.isOwner,
    pinFailCount: 0,
  };

  await memberRef.set({
    ...memberDoc,
    joinedAt: FieldValue.serverTimestamp(),
    pinLockedUntil: null,
  });

  await setMemberSessionCookie(slug, memberRef.id, token);
}

export type CreateGroupState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function createGroupAction(
  _prevState: CreateGroupState,
  formData: FormData
): Promise<CreateGroupState> {
  const name = String(formData.get("name") ?? "").trim();
  const typeIdRaw = String(formData.get("typeId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const iconRaw = String(formData.get("icon") ?? "");
  const memberTargetRaw = Number(formData.get("memberTarget"));
  const creatorName = String(formData.get("creatorName") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  const pinConfirm = String(formData.get("pinConfirm") ?? "").trim();

  if (!name) {
    return { status: "error", error: "모임 이름을 입력해주세요." };
  }
  if (name.length > GROUP_NAME_MAX_LENGTH) {
    return {
      status: "error",
      error: `모임 이름은 ${GROUP_NAME_MAX_LENGTH}자 이내로 입력해주세요.`,
    };
  }
  if (description.length > GROUP_DESCRIPTION_MAX_LENGTH) {
    return {
      status: "error",
      error: `소개는 ${GROUP_DESCRIPTION_MAX_LENGTH}자 이내로 입력해주세요.`,
    };
  }
  if (!creatorName) {
    return { status: "error", error: "내 이름(닉네임)을 입력해주세요." };
  }
  if (creatorName.length > MEMBER_NAME_MAX_LENGTH) {
    return {
      status: "error",
      error: `이름은 ${MEMBER_NAME_MAX_LENGTH}자 이내로 입력해주세요.`,
    };
  }
  const pinError = validatePin(pin, pinConfirm);
  if (pinError) {
    return { status: "error", error: pinError };
  }

  const typeId: GroupTypeId = GROUP_TYPES.some((t) => t.id === typeIdRaw)
    ? (typeIdRaw as GroupTypeId)
    : "friend";
  const icon = GROUP_ICONS.includes(iconRaw) ? iconRaw : GROUP_ICONS[0];
  const memberTarget = Number.isFinite(memberTargetRaw)
    ? Math.min(
        MEMBER_TARGET_MAX,
        Math.max(MEMBER_TARGET_MIN, Math.round(memberTargetRaw))
      )
    : MEMBER_TARGET_MIN;

  const db = getDb();
  const groups = db.collection("groups");

  let slug = generateSlug();
  if ((await groups.doc(slug).get()).exists) {
    slug = generateSlug();
  }

  const groupDoc: GroupDoc = {
    name,
    typeId,
    description,
    icon,
    memberTarget,
    createdAt: null,
  };

  const groupRef = groups.doc(slug);
  await groupRef.set({
    ...groupDoc,
    createdAt: FieldValue.serverTimestamp(),
  });

  await createMemberAndSignIn(slug, groupRef, {
    name: creatorName,
    pin,
    isOwner: true,
  });

  redirect(`/g/${slug}?welcome=1`);
}

export type JoinGroupState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function joinNewMemberAction(
  _prevState: JoinGroupState,
  formData: FormData
): Promise<JoinGroupState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  const pinConfirm = String(formData.get("pinConfirm") ?? "").trim();

  if (!slug) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  if (!name) {
    return { status: "error", error: "이름(닉네임)을 입력해주세요." };
  }
  if (name.length > MEMBER_NAME_MAX_LENGTH) {
    return {
      status: "error",
      error: `이름은 ${MEMBER_NAME_MAX_LENGTH}자 이내로 입력해주세요.`,
    };
  }
  const pinError = validatePin(pin, pinConfirm);
  if (pinError) {
    return { status: "error", error: pinError };
  }

  const db = getDb();
  const groupRef = db.collection("groups").doc(slug);
  const groupSnap = await groupRef.get();
  if (!groupSnap.exists) {
    return { status: "error", error: "존재하지 않는 모임이에요." };
  }

  const membersRef = groupRef.collection("members");
  if (await isNameTaken(membersRef, name.toLowerCase())) {
    return {
      status: "error",
      error: "이미 모임에 있는 이름이에요. 혹시 그 사람이라면 '기존 이름으로 들어가기'를 눌러주세요.",
    };
  }

  await createMemberAndSignIn(slug, groupRef, { name, pin, isOwner: false });

  redirect(`/g/${slug}`);
}

export type LoginState =
  | { status: "idle" }
  | { status: "error"; error: string };

export async function loginWithPinAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const memberId = String(formData.get("memberId") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();

  if (!slug || !memberId) {
    return { status: "error", error: "잘못된 요청입니다." };
  }
  if (!PIN_REGEX.test(pin)) {
    return { status: "error", error: "PIN은 숫자 4자리로 입력해주세요." };
  }

  const db = getDb();
  const memberRef = db
    .collection("groups")
    .doc(slug)
    .collection("members")
    .doc(memberId);
  const snap = await memberRef.get();
  if (!snap.exists) {
    return { status: "error", error: "존재하지 않는 멤버예요." };
  }
  const data = snap.data() as MemberDoc;

  if (data.pinLockedUntil && data.pinLockedUntil.toMillis() > Date.now()) {
    return {
      status: "error",
      error: "PIN을 너무 많이 틀렸어요. 5분 후 다시 시도해주세요.",
    };
  }

  const ok = verifyPin(pin, data.pinHash, data.pinSalt);
  if (!ok) {
    const failCount = (data.pinFailCount ?? 0) + 1;
    if (failCount >= MAX_PIN_ATTEMPTS) {
      await memberRef.update({
        pinFailCount: 0,
        pinLockedUntil: Timestamp.fromMillis(Date.now() + PIN_LOCK_MS),
      });
      return {
        status: "error",
        error: "PIN을 너무 많이 틀렸어요. 5분 후 다시 시도해주세요.",
      };
    }
    await memberRef.update({ pinFailCount: failCount });
    return {
      status: "error",
      error: `PIN이 틀렸어요. (${MAX_PIN_ATTEMPTS - failCount}번 더 시도할 수 있어요)`,
    };
  }

  const token = generateToken();
  const nextTokens = [...(data.sessionTokens ?? []), token].slice(
    -MAX_SESSION_TOKENS
  );
  await memberRef.update({
    sessionTokens: nextTokens,
    pinFailCount: 0,
    pinLockedUntil: null,
  });

  await setMemberSessionCookie(slug, memberId, token);

  redirect(`/g/${slug}`);
}
