export const MEMORY_TEXT_MAX_LENGTH = 300;
export const MEMORY_IMAGE_MIME_PREFIX = "data:image/jpeg;base64,";
export const MEMORY_IMAGE_MAX_BASE64_LENGTH = 700_000;
// 클라이언트에서 사진을 리사이즈할 때 쓰는 최대 긴 변 길이(px)
export const MEMORY_IMAGE_MAX_DIMENSION = 1000;

export type MemoryDoc = {
  authorId: string;
  authorName: string;
  text: string;
  photoDataUrl: string | null;
  createdAt: FirebaseFirestore.Timestamp | null;
};
