import { MEMORY_IMAGE_MAX_DIMENSION } from "./memories";

// 브라우저에서 사진을 긴 변 기준으로 리사이즈해 JPEG data URL로 반환한다.
// Firebase Storage 없이 Firestore 문서에 바로 저장할 수 있을 만큼 용량을 줄이기 위함.
export function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MEMORY_IMAGE_MAX_DIMENSION / Math.max(img.width, img.height));
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
