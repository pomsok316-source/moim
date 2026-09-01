import { ImageResponse } from "next/og";
import { computeGroupReport } from "@/lib/report";
import { TRAITS } from "@/lib/personality";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "모임 리포트";

const PALETTE = {
  cream: "#fff8f0",
  creamDeep: "#ffefdd",
  coral: "#ff8a65",
  coralDark: "#e2603f",
  butter: "#ffd166",
  ink: "#4a3728",
  inkSoft: "#8a7666",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await computeGroupReport(slug);

  if (!report) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: PALETTE.cream,
            fontSize: 48,
            color: PALETTE.ink,
          }}
        >
          302호
        </div>
      ),
      size
    );
  }

  const typeLabel = report.groupTypeId ? TRAITS[report.groupTypeId].groupTitle : null;
  const typeEmoji = report.groupTypeId ? TRAITS[report.groupTypeId].emoji : "🏠";

  const stats: { label: string; value: string }[] = [
    { label: "함께한 기간", value: `${report.daysTogether}일` },
    { label: "멤버", value: `${report.memberCount}명` },
    { label: "받은 편지", value: `${report.letterCount}개` },
    { label: "기억에 남는 순간", value: `${report.memoryCount}개` },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 64,
          background: `linear-gradient(160deg, ${PALETTE.creamDeep} 0%, ${PALETTE.cream} 60%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 72 }}>{report.groupIcon}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: PALETTE.coralDark }}>
              {report.groupName} REPORT
            </div>
            {typeLabel && (
              <div style={{ display: "flex", fontSize: 28, color: PALETTE.inkSoft, marginTop: 6 }}>
                {typeEmoji} {typeLabel}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, marginTop: 56 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                borderRadius: 28,
                padding: "28px 32px",
                minWidth: 180,
              }}
            >
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: PALETTE.coralDark }}>
                {s.value}
              </div>
              <div style={{ display: "flex", fontSize: 20, color: PALETTE.inkSoft, marginTop: 6 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {report.bestChemistry && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 40,
              fontSize: 30,
              color: PALETTE.ink,
            }}
          >
            <div style={{ display: "flex" }}>🏆 최고의 케미</div>
            <div style={{ display: "flex", fontWeight: 700 }}>
              {report.bestChemistry.aName} × {report.bestChemistry.bName}
            </div>
            <div style={{ display: "flex", fontWeight: 700, color: PALETTE.coralDark }}>
              {report.bestChemistry.percent}%
            </div>
          </div>
        )}

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 26,
            color: PALETTE.coralDark,
            fontWeight: 700,
          }}
        >
          🚪 302호
        </div>
      </div>
    ),
    size
  );
}
