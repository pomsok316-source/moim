export const PLACE_NAME_MAX_LENGTH = 30;
export const PLACE_DESCRIPTION_MAX_LENGTH = 300;

export type PlaceDoc = {
  authorId: string;
  authorName: string;
  placeName: string;
  visitedDate: string | null; // "YYYY-MM-DD" 형식의 사용자 입력값
  description: string;
  photoDataUrl: string | null;
  createdAt: FirebaseFirestore.Timestamp | null;
};
