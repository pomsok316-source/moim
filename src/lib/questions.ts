// 서로에게 질문 (투표) 기본 질문 은행.
// 공격적이거나 민감한 질문은 넣지 않는다 — 재미있고 훈훈한 것만.
export type QuestionDef = {
  id: string;
  emoji: string;
  text: string;
};

export const QUESTIONS: QuestionDef[] = [
  { id: "marriage", emoji: "💍", text: "우리 모임에서 가장 먼저 결혼할 것 같은 사람은?" },
  { id: "travel", emoji: "✈️", text: "같이 여행을 가고 싶은 사람은?" },
  { id: "trustworthy", emoji: "🤝", text: "가장 믿음직한 사람은?" },
  { id: "funny", emoji: "😂", text: "가장 웃긴 사람은?" },
  { id: "suddentrip", emoji: "🧳", text: "갑자기 해외여행 가자고 할 것 같은 사람은?" },
  { id: "planner", emoji: "🗓️", text: "가장 계획적으로 사는 사람은?" },
  { id: "slowreply", emoji: "🐢", text: "가장 답장이 느릴 것 같은 사람은?" },
  { id: "allday", emoji: "☀️", text: "같이 하루 종일 놀아도 안 질릴 것 같은 사람은?" },
];

export function getQuestion(id: string): QuestionDef | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
