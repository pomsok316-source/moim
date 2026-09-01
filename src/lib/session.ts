import "server-only";
import { cookies } from "next/headers";
import { getDb } from "./firebaseAdmin";
import { sessionCookieName, type MemberDoc } from "./group";

export type MemberSession = {
  memberId: string;
  name: string;
  isOwner: boolean;
};

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1년

export async function setMemberSessionCookie(
  slug: string,
  memberId: string,
  token: string
) {
  const store = await cookies();
  store.set(sessionCookieName(slug), `${memberId}.${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/g/${slug}`,
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

// 쿠키의 memberId.token을 실제 Firestore 멤버 문서와 대조해 세션을 검증한다.
// slug만으로는 절대 다른 모임의 데이터를 볼 수 없도록, 항상 groups/{slug}/members 하위에서만 조회한다.
export async function getMemberSession(
  slug: string
): Promise<MemberSession | null> {
  const store = await cookies();
  const raw = store.get(sessionCookieName(slug))?.value;
  if (!raw) return null;

  const dotIndex = raw.indexOf(".");
  if (dotIndex <= 0) return null;
  const memberId = raw.slice(0, dotIndex);
  const token = raw.slice(dotIndex + 1);
  if (!memberId || !token) return null;

  const db = getDb();
  const snap = await db
    .collection("groups")
    .doc(slug)
    .collection("members")
    .doc(memberId)
    .get();

  if (!snap.exists) return null;
  const data = snap.data() as MemberDoc;
  if (!Array.isArray(data.sessionTokens) || !data.sessionTokens.includes(token)) {
    return null;
  }

  return { memberId, name: data.name, isOwner: data.isOwner };
}
