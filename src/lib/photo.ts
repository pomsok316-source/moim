// 추억/장소 등 여러 기능에서 공용으로 쓰는 사진 첨부 관련 상수 + 브라우저 리사이즈 유틸.
// Firebase Storage 없이 Firestore 문서에 base64로 바로 저장할 수 있도록 용량을 줄인다.

export const PHOTO_MIME_PREFIX = "data:image/jpeg;base64,";
export const PHOTO_MAX_BASE64_LENGTH = 700_000;
// 클라이언트에서 사진을 리사이즈할 때 쓰는 최대 긴 변 길이(px)
export const PHOTO_MAX_DIMENSION = 1000;

export function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, PHOTO_MAX_DIMENSION / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas context를 만들 수 없어요."));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("이미지를 불러올 수 없어요."));
    };
    img.src = objectUrl;
  });
}
