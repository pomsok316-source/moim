"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MemberAvatar from "./MemberAvatar";
import { TRAITS, type TraitId } from "@/lib/personality";

export type RoomMember = {
  id: string;
  name: string;
  personalityTypeId: TraitId | null;
};

type Hotspot = {
  id: string;
  label: string;
  teaser: string;
  href: string;
};

function buildHotspots(slug: string): Hotspot[] {
  return [
    { id: "personality", label: "우리들의 성향", teaser: "거울 속 우리 모임의 성향을 확인해보세요.", href: `/g/${slug}/personality` },
    { id: "compatibility", label: "우리 궁합", teaser: "누구랑 잘 맞는지 확인해보세요.", href: `/g/${slug}/compatibility` },
    { id: "roles", label: "우리들의 역할", teaser: "각자 맡은 역할을 확인해보세요.", href: `/g/${slug}/roles` },
    { id: "questions", label: "서로의 생각", teaser: "친구들 생각이 쪽지로 쌓이는 중이에요.", href: `/g/${slug}/questions` },
    { id: "letters", label: "우리에게 온 편지", teaser: "받은 편지를 확인하거나 편지를 써보세요.", href: `/g/${slug}/letters` },
    { id: "memories", label: "우리만의 이야기", teaser: "책장 속 우리 이야기를 확인해보세요.", href: `/g/${slug}/memories` },
    { id: "places", label: "우리가 함께한 곳", teaser: "함께 갔던 곳들을 확인해보세요.", href: `/g/${slug}/places` },
    { id: "report", label: "모임 리포트", teaser: "우리 모임 리포트를 확인해보세요.", href: `/g/${slug}/report` },
  ];
}

function Sparkle({ x, y, size, fill }: { x: number; y: number; size: number; fill: string }) {
  return (
    <path
      d={`M${x},${y - size} Q${x + size * 0.22},${y - size * 0.22} ${x + size},${y} Q${x + size * 0.22},${y + size * 0.22} ${x},${y + size} Q${x - size * 0.22},${y + size * 0.22} ${x - size},${y} Q${x - size * 0.22},${y - size * 0.22} ${x},${y - size} Z`}
      fill={fill}
    />
  );
}

function activityToPlant(score: number) {
  if (score >= 10) return { leaves: 6, height: 34, potW: 26 };
  if (score >= 4) return { leaves: 4, height: 24, potW: 22 };
  return { leaves: 2, height: 14, potW: 18 };
}

export default function RoomScene({
  slug,
  members,
  letterCount,
  memoryCount,
  placeCount,
}: {
  slug: string;
  members: RoomMember[];
  letterCount: number;
  memoryCount: number;
  placeCount: number;
}) {
  const router = useRouter();
  const HOTSPOTS = buildHotspots(slug);
  const [active, setActive] = useState<Hotspot | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [pickedMember, setPickedMember] = useState<RoomMember | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handlePick = (h: Hotspot) => {
    setOpeningId(h.id);
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(() => router.push(h.href), 240);

    setActive(h);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActive(null), 2600);
  };

  const byId = (id: string) => HOTSPOTS.find((h) => h.id === id)!;
  const cls = (id: string) => `hotspot${openingId === id ? " hotspot-opening" : ""}`;

  const activityScore = members.length + letterCount + memoryCount + placeCount;
  const plant = activityToPlant(activityScore);
  const pinCount = Math.min(placeCount, 5);
  const shownMembers = members.slice(0, 7);
  const overflow = members.length - shownMembers.length;

  return (
    <div>
      <div className="sky-card overflow-hidden p-0">
        <svg viewBox="0 0 400 280" className="block w-full">
          {/* 벽 */}
          <rect x="0" y="0" width="400" height="195" fill="var(--wall)" />
          {/* 바닥 */}
          <rect x="0" y="195" width="400" height="85" fill="var(--floor)" />
          <rect x="0" y="190" width="400" height="8" fill="var(--wall-trim)" />
          {[213, 233, 253, 273].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="var(--floor-dark)" strokeWidth="1.5" opacity="0.35" />
          ))}

          {/* 창문 */}
          <rect x="16" y="4" width="48" height="28" rx="3" fill="var(--wall-trim)" />
          <rect x="21" y="9" width="38" height="12" fill="var(--dusk-top)" />
          <rect x="21" y="21" width="38" height="6" fill="var(--dusk-bottom)" />
          <rect x="38.5" y="9" width="2" height="18" fill="var(--wall-trim)" />
          <rect x="21" y="20" width="38" height="2" fill="var(--wall-trim)" />
          <polygon points="16,6 9,16 16,26" fill="var(--coral)" />
          <polygon points="64,6 71,16 64,26" fill="var(--coral)" />

          {/* 조명 */}
          <line x1="200" y1="0" x2="200" y2="26" stroke="var(--floor-dark)" strokeWidth="2" />
          <ellipse cx="200" cy="48" rx="20" ry="7" fill="var(--window-lit)" opacity="0.35" />
          <polygon points="186,26 214,26 207,42 193,42" fill="var(--coral)" />

          {/* 러그 */}
          <ellipse cx="200" cy="248" rx="92" ry="22" fill="var(--butter)" opacity="0.5" />
          <ellipse cx="200" cy="248" rx="66" ry="15" fill="none" stroke="var(--cream)" strokeWidth="2" opacity="0.5" />

          {/* --- 벽걸이 4종 --- */}
          {/* 거울: 성향 */}
          <g
            className={cls("personality")}
            onClick={() => handlePick(byId("personality"))}
            role="button"
            aria-label={byId("personality").label}
          >
            <ellipse cx="70" cy="72" rx="30" ry="33" fill="var(--frame)" />
            <ellipse cx="70" cy="72" rx="22" ry="25" fill="var(--glass)" />
            <polygon points="60,52 68,52 78,92 70,92" fill="#ffffff" opacity="0.35" />
            <Sparkle x={82} y={58} size={5} fill="var(--butter)" />
          </g>

          {/* 하트 액자: 궁합 */}
          <g
            className={cls("compatibility")}
            onClick={() => handlePick(byId("compatibility"))}
            role="button"
            aria-label={byId("compatibility").label}
          >
            <rect x="130" y="42" width="60" height="56" rx="6" fill="var(--frame)" />
            <rect x="136" y="48" width="48" height="44" rx="3" fill="var(--cream)" />
            <circle cx="155" cy="66" r="7" fill="var(--coral)" />
            <circle cx="166" cy="66" r="7" fill="var(--coral)" />
            <polygon points="147.5,70 173.5,70 160.5,86" fill="var(--coral)" />
          </g>

          {/* 메달 액자: 역할 */}
          <g
            className={cls("roles")}
            onClick={() => handlePick(byId("roles"))}
            role="button"
            aria-label={byId("roles").label}
          >
            <rect x="220" y="42" width="60" height="56" rx="6" fill="var(--frame)" />
            <rect x="226" y="48" width="48" height="44" rx="3" fill="var(--cream)" />
            <polygon points="245,78 250,92 250,80" fill="var(--coral)" />
            <polygon points="255,78 250,92 250,80" fill="var(--coral-dark)" />
            <circle cx="250" cy="70" r="12" fill="var(--butter)" />
            <circle cx="250" cy="70" r="7" fill="var(--frame)" />
          </g>

          {/* 코르크보드: 서로의 생각 */}
          <g
            className={cls("questions")}
            onClick={() => handlePick(byId("questions"))}
            role="button"
            aria-label={byId("questions").label}
          >
            <rect x="310" y="42" width="60" height="56" rx="4" fill="var(--door-dark)" />
            <rect x="317" y="49" width="20" height="16" fill="var(--cream)" transform="rotate(-4 327 57)" />
            <circle cx="327" cy="51" r="1.8" fill="var(--coral)" transform="rotate(-4 327 57)" />
            <rect x="343" y="52" width="20" height="16" fill="var(--butter)" transform="rotate(5 353 60)" />
            <circle cx="353" cy="54" r="1.8" fill="var(--coral-dark)" transform="rotate(5 353 60)" />
            <rect x="323" y="75" width="16" height="13" fill="var(--mint)" transform="rotate(-2 331 81)" />
          </g>

          {/* --- 바닥 가구 4종 --- */}
          {/* 우체통: 편지 */}
          <g
            className={cls("letters")}
            onClick={() => handlePick(byId("letters"))}
            role="button"
            aria-label={byId("letters").label}
          >
            <rect x="52" y="222" width="6" height="48" fill="var(--roof)" />
            <rect x="32" y="196" width="44" height="30" rx="6" fill="var(--coral)" />
            <rect x="32" y="196" width="44" height="9" rx="4" fill="var(--door-dark)" />
            <rect x="42" y="208" width="24" height="14" rx="1.5" fill="var(--cream)" />
            <polyline points="42,208 54,217 66,208" fill="none" stroke="var(--coral-dark)" strokeWidth="1.5" />
            {letterCount > 0 && (
              <g>
                <circle cx="74" cy="193" r="10" fill="var(--coral-dark)" />
                <text x="74" y="197" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">
                  {letterCount > 9 ? "9+" : letterCount}
                </text>
              </g>
            )}
          </g>

          {/* 책장: 이야기 (+ 화분) */}
          <g
            className={cls("memories")}
            onClick={() => handlePick(byId("memories"))}
            role="button"
            aria-label={byId("memories").label}
          >
            <rect x="118" y="188" width="68" height="72" rx="3" fill="var(--door-dark)" />
            <rect x="124" y="194" width="56" height="60" fill="var(--wall)" />
            <rect x="124" y="224" width="56" height="2.5" fill="var(--door-dark)" opacity="0.4" />
            <rect x="130" y="230" width="8" height="22" fill="var(--coral)" />
            <rect x="141" y="226" width="8" height="26" fill="var(--mint)" />
            <rect x="152" y="232" width="8" height="20" fill="var(--butter)" />
            <rect x="163" y="228" width="8" height="24" fill="var(--frame)" />
            {memoryCount > 0 && (
              <g transform="rotate(-8 172 205)">
                <rect x="164" y="196" width="16" height="19" fill="var(--cream)" />
                <rect x="166" y="198" width="12" height="11" fill="var(--mint)" />
              </g>
            )}
          </g>
          {/* 책장 위 화분 (활동량에 따라 성장) */}
          <g>
            <polygon
              points={`${175 - plant.potW / 2},188 ${175 + plant.potW / 2},188 ${172},202 ${178},202`}
              fill="var(--bldg-roof)"
            />
            <line x1="175" y1="188" x2="175" y2={188 - plant.height} stroke="var(--mint)" strokeWidth="2" />
            {Array.from({ length: plant.leaves }).map((_, i) => {
              const t = i / Math.max(1, plant.leaves - 1);
              const yy = 186 - t * plant.height;
              const dir = i % 2 === 0 ? -1 : 1;
              return (
                <ellipse
                  key={i}
                  cx={175 + dir * 7}
                  cy={yy}
                  rx="7"
                  ry="4"
                  fill="var(--mint)"
                  transform={`rotate(${dir * 30} ${175 + dir * 7} ${yy})`}
                />
              );
            })}
          </g>

          {/* 지구본: 함께한 곳 */}
          <g
            className={cls("places")}
            onClick={() => handlePick(byId("places"))}
            role="button"
            aria-label={byId("places").label}
          >
            <ellipse cx="250" cy="270" rx="24" ry="6" fill="var(--door-dark)" opacity="0.85" />
            <rect x="244" y="246" width="12" height="24" fill="var(--door-dark)" />
            <circle cx="250" cy="230" r="22" fill="var(--mint)" />
            <ellipse cx="250" cy="230" rx="8" ry="22" fill="none" stroke="var(--cream)" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="250" cy="230" rx="16" ry="22" fill="none" stroke="var(--cream)" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="250" cy="230" rx="22" ry="7" fill="none" stroke="var(--cream)" strokeWidth="1.5" opacity="0.6" />
            {Array.from({ length: pinCount }).map((_, i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
              const px = 250 + Math.cos(angle) * 24;
              const py = 230 + Math.sin(angle) * 24;
              return <circle key={i} cx={px} cy={py} r="3" fill="var(--coral-dark)" />;
            })}
          </g>

          {/* TV: 리포트 */}
          <g
            className={cls("report")}
            onClick={() => handlePick(byId("report"))}
            role="button"
            aria-label={byId("report").label}
          >
            <ellipse cx="342" cy="252" rx="26" ry="5" fill="var(--door-dark)" opacity="0.85" />
            <rect x="333" y="233" width="18" height="16" fill="var(--door-dark)" />
            <rect x="313" y="193" width="58" height="42" rx="4" fill="var(--window-dark)" />
            <rect x="319" y="199" width="14" height="10" fill="var(--coral)" />
            <rect x="335" y="203" width="14" height="6" fill="var(--mint)" />
            <rect x="351" y="196" width="14" height="13" fill="var(--butter)" />
            <Sparkle x={360} y={202} size={4.5} fill="var(--butter)" />
          </g>

          {/* 라벨 */}
          <g className="select-none" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="10.5" fontWeight="700" fill="var(--ink-soft)">
            <text x="70" y="117" textAnchor="middle">성향</text>
            <text x="160" y="117" textAnchor="middle">궁합</text>
            <text x="250" y="117" textAnchor="middle">역할</text>
            <text x="340" y="117" textAnchor="middle">생각</text>
          </g>
          <g className="select-none" fontFamily="ui-monospace, SFMono-Regular, monospace" fontSize="10.5" fontWeight="700" fill="var(--wall-trim)">
            <text x="54" y="278" textAnchor="middle">편지</text>
            <text x="152" y="278" textAnchor="middle">이야기</text>
            <text x="250" y="278" textAnchor="middle">함께한곳</text>
            <text x="342" y="278" textAnchor="middle">리포트</text>
          </g>
        </svg>

        {/* 방에 놀러온 멤버들 */}
        {shownMembers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto border-t border-black/5 bg-white/70 px-3 py-2.5">
            {shownMembers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPickedMember((cur) => (cur?.id === m.id ? null : m))}
                className="flex shrink-0 flex-col items-center gap-0.5 transition active:scale-90"
              >
                <MemberAvatar name={m.name} size={34} />
                <span className="max-w-[44px] truncate text-[10px] font-bold text-[var(--ink)]">
                  {m.name}
                </span>
              </button>
            ))}
            {overflow > 0 && (
              <span className="shrink-0 text-xs font-bold text-[var(--ink-soft)]">+{overflow}</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 min-h-[52px]">
        {pickedMember ? (
          <div className="card animate-pop-in flex items-center gap-3 border border-black/5 px-4 py-3">
            <MemberAvatar name={pickedMember.name} size={36} />
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--ink)]">{pickedMember.name}</p>
              <p className="text-xs text-[var(--ink-soft)]">
                {pickedMember.personalityTypeId
                  ? `${TRAITS[pickedMember.personalityTypeId].emoji} ${TRAITS[pickedMember.personalityTypeId].personalTitle}`
                  : "아직 성향 테스트 전이에요"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/g/${slug}/compatibility`)}
              className="rounded-full bg-[var(--coral)]/10 px-3 py-1.5 text-xs font-bold text-[var(--coral-dark)]"
            >
              궁합 보기
            </button>
          </div>
        ) : active ? (
          <div className="card animate-pop-in flex items-center gap-2 border border-black/5 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">{active.label}</p>
              <p className="text-xs text-[var(--ink-soft)]">{active.teaser}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
