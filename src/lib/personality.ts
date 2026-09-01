// 성향 테스트의 8가지 축. 개인 성향 유형 / 모임 전체 성향 / 멤버 궁합 / 모임 역할이
// 모두 이 하나의 트레잇 시스템에서 계산된다 (별도 데이터 없이도 일관성 있게 확장 가능).

export type TraitId =
  | "mood"
  | "planner"
  | "foodie"
  | "photographer"
  | "treasurer"
  | "late"
  | "sentimental"
  | "spontaneous";

export type TraitMeta = {
  id: TraitId;
  emoji: string;
  // 개인 성향 결과 카드
  personalTitle: string;
  personalDesc: string;
  // 모임 전체 성향 결과 카드
  groupTitle: string;
  groupDesc: string;
  // 모임 역할 배지
  roleLabel: string;
  // 우리 모임 특징 bullet
  bullet: string;
  // 궁합 이유 문장에 쓰이는 구
  reasonPhrase: string;
};

export const TRAITS: Record<TraitId, TraitMeta> = {
  mood: {
    id: "mood",
    emoji: "🎉",
    personalTitle: "분위기 메이커",
    personalDesc: "사람들과 함께 있을 때 가장 행복한 타입이에요.",
    groupTitle: "시끌벅적한 추억 수집가",
    groupDesc: "새로운 경험을 좋아하고 함께 있을 때 가장 행복한 모임이에요.",
    roleLabel: "분위기 메이커",
    bullet: "함께 노는 것을 좋아해요",
    reasonPhrase: "사람들과 함께 있을 때 제일 즐거워하는",
  },
  planner: {
    id: "planner",
    emoji: "🧭",
    personalTitle: "계획형 리더",
    personalDesc: "자연스럽게 모임의 방향을 정하는 타입이에요.",
    groupTitle: "계획적인 탐험대",
    groupDesc: "다음 약속과 다음 여행을 늘 미리 그려보는 모임이에요.",
    roleLabel: "계획 담당",
    bullet: "계획 세우는 걸 좋아해요",
    reasonPhrase: "계획 세우고 실행하는 걸 좋아하는",
  },
  foodie: {
    id: "foodie",
    emoji: "🍴",
    personalTitle: "맛집 헌터",
    personalDesc: "어디든 맛있는 곳을 기가 막히게 찾아내는 타입이에요.",
    groupTitle: "맛집 원정대",
    groupDesc: "어디를 가든 먹는 얘기부터 시작하는 모임이에요.",
    roleLabel: "맛집 헌터",
    bullet: "맛있는 것을 중요하게 생각해요",
    reasonPhrase: "맛있는 걸 찾아다니는 걸 좋아하는",
  },
  photographer: {
    id: "photographer",
    emoji: "📸",
    personalTitle: "기록 담당",
    personalDesc: "순간순간을 사진과 영상으로 남기는 타입이에요.",
    groupTitle: "순간 수집가들",
    groupDesc: "함께한 모든 장면을 사진으로 남겨두는 모임이에요.",
    roleLabel: "기록 담당",
    bullet: "추억을 사진으로 잘 남겨요",
    reasonPhrase: "순간을 기록으로 남기고 싶어하는",
  },
  treasurer: {
    id: "treasurer",
    emoji: "💸",
    personalTitle: "든든한 총무",
    personalDesc: "정산이랑 예약, 챙길 건 다 챙기는 든든한 타입이에요.",
    groupTitle: "정산의 달인들",
    groupDesc: "N빵도 계획도 빈틈없이 챙기는 알뜰한 모임이에요.",
    roleLabel: "총무",
    bullet: "꼼꼼하게 잘 챙겨요",
    reasonPhrase: "꼼꼼하게 잘 챙기는",
  },
  late: {
    id: "late",
    emoji: "😴",
    personalTitle: "여유만점 지각러",
    personalDesc: "약속 시간 앞에서도 마이페이스를 지키는 여유로운 타입이에요.",
    groupTitle: "마이페이스 모임",
    groupDesc: "조금 늦어도 다 같이 있으면 그걸로 충분한 모임이에요.",
    roleLabel: "지각 담당",
    bullet: "느긋한 매력이 있어요",
    reasonPhrase: "여유롭게 자기 페이스를 지키는",
  },
  sentimental: {
    id: "sentimental",
    emoji: "🤍",
    personalTitle: "감성 기록가",
    personalDesc: "함께한 순간과 사람을 오래 기억하는 타입이에요.",
    groupTitle: "다정한 기록가들",
    groupDesc: "지나간 순간도 오래오래 마음에 담아두는 모임이에요.",
    roleLabel: "감성 담당",
    bullet: "순간을 오래 기억해요",
    reasonPhrase: "지나간 순간을 오래 기억하는",
  },
  spontaneous: {
    id: "spontaneous",
    emoji: "🔥",
    personalTitle: "즉흥 모험가",
    personalDesc: "갑자기 떠나는 여행도 즐거운 타입이에요.",
    groupTitle: "즉흥 모험단",
    groupDesc: "계획 없이 떠나도 늘 최고의 추억이 되는 모임이에요.",
    roleLabel: "즉흥 담당",
    bullet: "새로운 경험을 좋아해요",
    reasonPhrase: "즉흥적인 계획에도 긍정적인",
  },
};

export const TRAIT_IDS = Object.keys(TRAITS) as TraitId[];

export type PersonalityOption = {
  key: "A" | "B" | "C" | "D";
  text: string;
  trait: TraitId;
};

export type PersonalityQuestion = {
  id: string;
  text: string;
  options: PersonalityOption[];
};

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: "q1",
    text: "금요일 밤, 우리 모임 단톡방에 뜬 메시지는?",
    options: [
      { key: "A", text: "야 이번 주말에 갑자기 여행 갈 사람?!", trait: "spontaneous" },
      { key: "B", text: "이번 달 정산 정리해봤어요, 확인해주세요", trait: "treasurer" },
      { key: "C", text: "오늘 다 같이 찍은 사진 여기 올려요 📸", trait: "photographer" },
      { key: "D", text: "다음 모임 장소 후보 3개 뽑아왔어요", trait: "planner" },
    ],
  },
  {
    id: "q2",
    text: "다 같이 밥 먹으러 갈 때 나는?",
    options: [
      { key: "A", text: "여기 진짜 맛집인데 내가 예약해놨어", trait: "foodie" },
      { key: "B", text: "다들 재밌게 웃고 떠드는 게 제일 좋아", trait: "mood" },
      { key: "C", text: "다음에 여기 또 오자, 오늘 기억해둘게", trait: "sentimental" },
      { key: "D", text: "약속시간보다 살짝 늦게 도착 (미안!)", trait: "late" },
    ],
  },
  {
    id: "q3",
    text: "모임 단체사진을 찍을 때 나는?",
    options: [
      { key: "A", text: "다들 여기 봐요! 하나 둘 셋!", trait: "planner" },
      { key: "B", text: "이 순간 진짜 소중하다, 잘 간직해야지", trait: "sentimental" },
      { key: "C", text: "일단 나부터 사진 각도 체크", trait: "photographer" },
      { key: "D", text: "포즈 이상하게 해서 웃기기 담당", trait: "mood" },
    ],
  },
  {
    id: "q4",
    text: "갑자기 다음 주에 다 같이 여행 가자는 말이 나왔다",
    options: [
      { key: "A", text: "좋아! 당장 숙소부터 찾아볼게", trait: "spontaneous" },
      { key: "B", text: "예산부터 짜고 정산 계획 세우자", trait: "treasurer" },
      { key: "C", text: "코스 짜서 계획표 만들어올게", trait: "planner" },
      { key: "D", text: "오키오키, 근데 짐 싸는 데 좀 걸릴지도", trait: "late" },
    ],
  },
  {
    id: "q5",
    text: "우리 모임에서 나의 포지션은?",
    options: [
      { key: "A", text: "다들 심심할 때 먼저 톡 거는 사람", trait: "mood" },
      { key: "B", text: "맛집 리스트를 저장해두는 사람", trait: "foodie" },
      { key: "C", text: "같이 놀았던 순간을 사진첩에 저장하는 사람", trait: "photographer" },
      { key: "D", text: "다음 약속을 미리 잡아두는 사람", trait: "planner" },
    ],
  },
  {
    id: "q6",
    text: "친구가 힘든 일이 있다고 연락이 왔다",
    options: [
      { key: "A", text: "당장 만나서 기분 풀어주자, 나가자!", trait: "spontaneous" },
      { key: "B", text: "예전에 힘들 때 내가 어떻게 도와줬는지 기억나", trait: "sentimental" },
      { key: "C", text: "맛있는 거 사줄게, 일단 나와", trait: "foodie" },
      { key: "D", text: "얘기 들어주고 다독여주는 게 최고지", trait: "mood" },
    ],
  },
  {
    id: "q7",
    text: "모임 회비/정산 얘기가 나오면",
    options: [
      { key: "A", text: "내가 엑셀로 깔끔하게 정리해줄게", trait: "treasurer" },
      { key: "B", text: "음... 다음에 낼게 (텀블벅 정신)", trait: "late" },
      { key: "C", text: "그냥 즉흥적으로 N빵 하자", trait: "spontaneous" },
      { key: "D", text: "이때 사진 찍은 거, 회비 낸 사람만 공유 ㅋㅋ", trait: "photographer" },
    ],
  },
  {
    id: "q8",
    text: "다음 모임은 언제 할까?",
    options: [
      { key: "A", text: "일단 날짜부터 정하고 캘린더에 박아두자", trait: "planner" },
      { key: "B", text: "아무 때나! 갑자기 만나는 것도 재밌잖아", trait: "spontaneous" },
      { key: "C", text: "그날 뭐 맛있는 거 먹을지가 더 중요하지", trait: "foodie" },
      { key: "D", text: "다 같이 또 놀 생각하니까 벌써 설렌다", trait: "sentimental" },
    ],
  },
];

export function emptyScores(): Record<TraitId, number> {
  return {
    mood: 0,
    planner: 0,
    foodie: 0,
    photographer: 0,
    treasurer: 0,
    late: 0,
    sentimental: 0,
    spontaneous: 0,
  };
}

export function isValidAnswerSet(answers: unknown): answers is string[] {
  if (!Array.isArray(answers)) return false;
  if (answers.length !== PERSONALITY_QUESTIONS.length) return false;
  return PERSONALITY_QUESTIONS.every((q, i) =>
    q.options.some((o) => o.key === answers[i])
  );
}

export function scoreAnswers(answers: string[]): Record<TraitId, number> {
  const scores = emptyScores();
  PERSONALITY_QUESTIONS.forEach((q, i) => {
    const opt = q.options.find((o) => o.key === answers[i]);
    if (opt) scores[opt.trait] += 1;
  });
  return scores;
}

export function dominantTrait(scores: Record<TraitId, number>): TraitId {
  let best: TraitId = TRAIT_IDS[0];
  for (const id of TRAIT_IDS) {
    if (scores[id] > scores[best]) best = id;
  }
  return best;
}

export function topTraits(
  scores: Record<TraitId, number>,
  count: number
): TraitId[] {
  return [...TRAIT_IDS]
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, count);
}

const MAX_SCORE = PERSONALITY_QUESTIONS.length; // 8

export function computeCompatibilityPercent(
  a: Record<TraitId, number>,
  b: Record<TraitId, number>
): number {
  const overlap = TRAIT_IDS.reduce((sum, id) => sum + Math.min(a[id], b[id]), 0);
  const ratio = overlap / MAX_SCORE; // 0~1
  return Math.round(55 + ratio * 44); // 55~99 사이로, 항상 훈훈하게
}

export function mostSharedTrait(
  a: Record<TraitId, number>,
  b: Record<TraitId, number>
): TraitId {
  let best: TraitId = TRAIT_IDS[0];
  let bestVal = -1;
  for (const id of TRAIT_IDS) {
    const v = Math.min(a[id], b[id]);
    if (v > bestVal) {
      bestVal = v;
      best = id;
    }
  }
  return best;
}

export function compatibilityReason(
  a: Record<TraitId, number>,
  b: Record<TraitId, number>
): string {
  const trait = TRAITS[mostSharedTrait(a, b)];
  return `둘 다 ${trait.reasonPhrase} 편이에요.`;
}
