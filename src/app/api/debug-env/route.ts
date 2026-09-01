// 임시 진단용 라우트. Firebase 인증 실패 원인을 찾기 위한 것으로,
// 실제 비밀값(private_key 본문)은 절대 노출하지 않고 형태(길이/구조)만 확인한다.
// 문제 해결 후 반드시 삭제할 것.
import { getDb } from "@/lib/firebaseAdmin";

export async function GET() {
  const projectId = process.env.project_id?.trim();
  const clientEmail = process.env.client_email?.trim();
  const privateKeyRaw = process.env.private_key;

  const report: Record<string, unknown> = {
    projectIdPresent: !!projectId,
    projectIdValue: projectId ?? null,
    clientEmailPresent: !!clientEmail,
    clientEmailValue: clientEmail ?? null,
    privateKeyPresent: !!privateKeyRaw,
    privateKeyRawLength: privateKeyRaw?.length ?? 0,
    startsWithDoubleQuote: privateKeyRaw?.trim().startsWith('"') ?? false,
    endsWithDoubleQuote: privateKeyRaw?.trim().endsWith('"') ?? false,
    containsLiteralBackslashN: privateKeyRaw?.includes("\\n") ?? false,
    containsRealNewline: privateKeyRaw?.includes("\n") ?? false,
    beginMarkerCount: (privateKeyRaw?.match(/BEGIN PRIVATE KEY/g) ?? []).length,
    endMarkerCount: (privateKeyRaw?.match(/END PRIVATE KEY/g) ?? []).length,
    firstTwelveChars: privateKeyRaw?.trim().slice(0, 12) ?? null,
    lastTwelveChars: privateKeyRaw?.trim().slice(-12) ?? null,
  };

  try {
    const db = getDb();
    await db.collection("groups").limit(1).get();
    report.firestoreConnection = "OK";
  } catch (err) {
    report.firestoreConnection = "FAILED";
    report.firestoreError = err instanceof Error ? err.message : String(err);
  }

  return Response.json(report);
}
