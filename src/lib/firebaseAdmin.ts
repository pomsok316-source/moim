import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }

  const projectId = process.env.project_id?.trim();
  const clientEmail = process.env.client_email?.trim();
  // Vercel 환경변수 입력창에 값을 큰따옴표로 감싼 채로 붙여넣는 실수가 흔해서,
  // 감싸는 따옴표가 있으면 벗겨내고, \n으로 이스케이프된 줄바꿈도 실제 줄바꿈으로 되돌린다.
  const privateKeyRaw = process.env.private_key?.trim();
  const privateKey = privateKeyRaw
    ?.replace(/^"([\s\S]*)"$/, "$1")
    .replace(/^'([\s\S]*)'$/, "$1")
    .replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin 자격 증명이 없습니다. project_id, client_email, private_key 환경변수를 설정해주세요."
    );
  }
  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "private_key 값이 올바른 PEM 키 형식이 아닙니다. 서비스 계정 JSON의 private_key 값을 그대로(감싸는 큰따옴표 없이) 붙여넣었는지 확인해주세요."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let dbInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getAdminApp());
  }
  return dbInstance;
}
