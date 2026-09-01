export const MEMORY_TEXT_MAX_LENGTH = 300;

export type MemoryDoc = {
  authorId: string;
  authorName: string;
  text: string;
  photoDataUrl: string | null;
  createdAt: FirebaseFirestore.Timestamp | null;
};
