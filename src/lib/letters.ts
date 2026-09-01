export type LetterPromptId =
  | "thanks"
  | "firstmet"
  | "goodtime"
  | "future"
  | "confession"
  | "onemessage";

export type LetterPrompt = {
  id: LetterPromptId;
  label: (recipientName: string) => string;
};

export const LETTER_PROMPTS: LetterPrompt[] = [
  { id: "thanks", label: (n) => `${n}에게 가장 고마웠던 순간` },
  { id: "firstmet", label: () => "처음 만났을 때 기억" },
  { id: "goodtime", label: (n) => `${n}와 함께해서 좋았던 순간` },
  { id: "future", label: () => "앞으로 같이 하고 싶은 것" },
  { id: "confession", label: () => "평소에는 하지 못했던 말" },
  { id: "onemessage", label: (n) => `${n}에게 하고 싶은 한마디` },
];

export function getLetterPrompt(id: string | null | undefined): LetterPrompt | undefined {
  return LETTER_PROMPTS.find((p) => p.id === id);
}

export const LETTER_MESSAGE_MAX_LENGTH = 600;

export type LetterDoc = {
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  promptId: LetterPromptId | null;
  promptLabel: string | null;
  message: string;
  createdAt: FirebaseFirestore.Timestamp | null;
};
