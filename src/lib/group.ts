// 모임(Group) 도메인의 타입과 상수.
// Firestore 구조:
//   groups/{slug}                     → GroupDoc
//   groups/{slug}/members/{memberId}  → MemberDoc
// slug는 초대 링크에 노출되는 공개 식별자, 각 멤버의 token은 절대 URL에 노출하지 않고
// httpOnly 쿠키에만 저장해 "이 브라우저 = 이 모임의 이 멤버"임을 서버에서 검증하는 데 쓴다.

export type GroupTypeId =
  | "friend"
  | "couple"
  | "family"
  | "school"
  | "club"
  | "company"
  | "travel"
  | "etc";

export type GroupType = {
  id: GroupTypeId;
  label: string;
  emoji: string;
};

export const GROUP_TYPES: GroupType[] = [
  { id: "friend", label: "친구", emoji: "🎉" },
  { id: "couple", label: "커플", emoji: "❤️" },
  { id: "family", label: "가족", emoji: "🏠" },
  { id: "school", label: "학교", emoji: "🎓" },
  { id: "club", label: "동아리", emoji: "🎪" },
  { id: "company", label: "회사", emoji: "💼" },
  { id: "travel", label: "여행", emoji: "✈️" },
  { id: "etc", label: "기타", emoji: "✨" },
];

export function getGroupType(id: string | undefined): GroupType {
  return GROUP_TYPES.find((t) => t.id === id) ?? GROUP_TYPES[0];
}

export const GROUP_ICONS = [
  "🏠",
  "🎉",
  "❤️",
  "👨‍👩‍👧‍👦",
  "🎓",
  "🎪",
  "💼",
  "✈️",
  "🌟",
  "🔥",
  "🍀",
  "🌈",
  "🐣",
  "🍊",
  "🌙",
  "☕",
];
export const DEFAULT_ICON = GROUP_ICONS[0];

export type GroupDoc = {
  name: string;
  typeId: GroupTypeId;
  description: string;
  icon: string;
  memberTarget: number;
  createdAt: FirebaseFirestore.Timestamp | null;
};

export type MemberDoc = {
  name: string;
  // 대소문자 무시 중복 체크용 (같은 모임 안에서 이름이 겹치면 PIN 로그인 시 헷갈리므로 유일해야 함)
  nameLower: string;
  pinHash: string;
  pinSalt: string;
  // 로그인 성공 때마다 새 토큰을 추가해, 여러 기기에서 동시에 "기억된 로그인" 상태를 유지할 수 있게 한다.
  sessionTokens: string[];
  isOwner: boolean;
  joinedAt: FirebaseFirestore.Timestamp | null;
  pinFailCount: number;
  pinLockedUntil: FirebaseFirestore.Timestamp | null;
};

export type MemberSummary = {
  id: string;
  name: string;
  isOwner: boolean;
};

export const SLUG_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
export const TOKEN_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const SLUG_LENGTH = 10;
export const TOKEN_LENGTH = 32;
// 한 멤버가 이 개수를 넘는 기기에서 로그인하면 가장 오래된 세션부터 밀려난다.
export const MAX_SESSION_TOKENS = 8;

export const GROUP_NAME_MAX_LENGTH = 20;
export const GROUP_DESCRIPTION_MAX_LENGTH = 80;
export const MEMBER_NAME_MAX_LENGTH = 12;
export const MEMBER_TARGET_MIN = 2;
export const MEMBER_TARGET_MAX = 50;

export const PIN_LENGTH = 4;
export const PIN_REGEX = /^\d{4}$/;
export const MAX_PIN_ATTEMPTS = 5;
export const PIN_LOCK_MS = 5 * 60 * 1000;

export const SESSION_COOKIE_PREFIX = "moim_m_";

export function sessionCookieName(slug: string): string {
  return `${SESSION_COOKIE_PREFIX}${slug}`;
}
