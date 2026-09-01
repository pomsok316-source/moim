import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMemberSession } from "@/lib/session";
import { computeGroupReport } from "@/lib/report";
import { TRAITS } from "@/lib/personality";
import ShareButton from "@/components/group/ShareButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const report = await computeGroupReport(slug);
  if (!report) return {};
  return {
    title: `${report.groupName} REPORT`,
    description: `${report.groupName} 모임 리포트를 확인해보세요 ✨`,
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getMemberSession(slug);
  if (!session) {
    redirect(`/g/${slug}`);
  }

  const report = await computeGroupReport(slug);
  if (!report) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href={`/g/${slug}`} className="text-sm text-[var(--ink-soft)]">
        ← {report.groupName}으로 돌아가기
      </Link>

      <div className="mt-4 text-center">
        <span className="text-4xl">{report.groupIcon}</span>
        <h1 className="font-heading mt-2 text-3xl text-[var(--ink)]">
          {report.groupName} REPORT
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="card border border-black/5 p-4 text-center">
          <p className="text-xs font-bold text-[var(--ink-soft)]">함께한 기간</p>
          <p className="font-heading mt-1 text-2xl text-[var(--coral-dark)]">
            {report.daysTogether}일
          </p>
        </div>
        <div className="card border border-black/5 p-4 text-center">
          <p className="text-xs font-bold text-[var(--ink-soft)]">멤버</p>
          <p className="font-heading mt-1 text-2xl text-[var(--coral-dark)]">
            {report.memberCount}명
          </p>
        </div>
      </div>

      {report.groupTypeId ? (
        <div className="sky-card mt-3 p-6 text-center">
          <p className="text-xs font-bold text-[var(--ink)]/70">우리 모임 유형</p>
          <p className="mt-1 text-3xl">{TRAITS[report.groupTypeId].emoji}</p>
          <p className="font-heading mt-1 text-xl text-[var(--ink)]">
            {TRAITS[report.groupTypeId].groupTitle}
          </p>
        </div>
      ) : (
        <div className="card mt-3 border border-black/5 p-4 text-center text-sm text-[var(--ink-soft)]">
          성향 테스트를 하면 우리 모임 유형이 나와요.{" "}
          <Link href={`/g/${slug}/personality`} className="font-bold text-[var(--coral-dark)]">
            테스트하러 가기
          </Link>
        </div>
      )}

      {report.bestChemistry && (
        <div className="card mt-3 border border-black/5 p-4">
          <p className="text-xs font-bold text-[var(--coral-dark)]">🏆 최고의 케미</p>
          <p className="font-heading mt-1 text-lg text-[var(--ink)]">
            {report.bestChemistry.aName} × {report.bestChemistry.bName}
          </p>
          <p className="text-2xl font-bold text-[var(--coral-dark)]">
            {report.bestChemistry.percent}%
          </p>
        </div>
      )}

      {report.moodBreakdown.length > 0 && (
        <div className="card mt-3 border border-black/5 p-4">
          <p className="mb-3 text-sm font-bold text-[var(--ink)]">우리 모임의 분위기</p>
          <div className="flex flex-col gap-2.5">
            {report.moodBreakdown.map((b) => (
              <div key={b.id}>
                <div className="mb-1 flex items-center justify-between text-xs font-bold text-[var(--ink-soft)]">
                  <span>
                    {TRAITS[b.id].emoji} {TRAITS[b.id].roleLabel}
                  </span>
                  <span>{b.percent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-[var(--coral)]"
                    style={{ width: `${b.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(report.mostMentioned || report.mostVisitedPlace) && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {report.mostMentioned && (
            <div className="card border border-black/5 p-4 text-center">
              <p className="text-xs font-bold text-[var(--ink-soft)]">
                가장 많이 언급된 사람
              </p>
              <p className="font-heading mt-1 text-xl text-[var(--ink)]">
                {report.mostMentioned.name}
              </p>
            </div>
          )}
          {report.mostVisitedPlace && (
            <div className="card border border-black/5 p-4 text-center">
              <p className="text-xs font-bold text-[var(--ink-soft)]">
                가장 많이 등장한 장소
              </p>
              <p className="font-heading mt-1 text-xl text-[var(--ink)]">
                📍 {report.mostVisitedPlace.name}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="card border border-black/5 p-3 text-center">
          <p className="text-lg font-bold text-[var(--coral-dark)]">{report.letterCount}</p>
          <p className="text-[10px] font-bold text-[var(--ink-soft)]">받은 편지</p>
        </div>
        <div className="card border border-black/5 p-3 text-center">
          <p className="text-lg font-bold text-[var(--coral-dark)]">{report.memoryCount}</p>
          <p className="text-[10px] font-bold text-[var(--ink-soft)]">기억에 남는 순간</p>
        </div>
        <div className="card border border-black/5 p-3 text-center">
          <p className="text-lg font-bold text-[var(--coral-dark)]">{report.placeCount}</p>
          <p className="text-[10px] font-bold text-[var(--ink-soft)]">함께한 장소</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="font-heading text-lg text-[var(--ink)]">
          {report.groupName}의 이야기는 아직 끝나지 않았어요.
        </p>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          지금까지 함께한 시간도, 앞으로 만들어갈 시간도.
        </p>
      </div>

      <div className="mt-6">
        <ShareButton
          path={`/g/${slug}/report`}
          shareTitle={`${report.groupName} REPORT ✨`}
          shareText={`${report.groupName} 모임 리포트를 확인해보세요 ✨`}
          copyLabel="리포트 링크 복사"
        />
      </div>
    </main>
  );
}
