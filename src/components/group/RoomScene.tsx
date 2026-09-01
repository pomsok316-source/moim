"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Hotspot = {
  id: string;
  emoji: string;
  label: string;
  teaser: string;
  href?: string;
};

function buildHotspots(slug: string): Hotspot[] {
  return [
    { id: "personality", emoji: "🎭", label: "우리들의 성향", teaser: "거울 속 우리 모임의 성향을 확인해보세요.", href: `/g/${slug}/personality` },
    { id: "compatibility", emoji: "❤️", label: "우리 궁합", teaser: "누구랑 잘 맞는지 확인해보세요.", href: `/g/${slug}/compatibility` },
    { id: "roles", emoji: "🎉", label: "우리들의 역할", teaser: "각자 맡은 역할을 확인해보세요.", href: `/g/${slug}/roles` },
    { id: "questions", emoji: "👀", label: "서로의 생각", teaser: "친구들 생각이 쪽지로 쌓이는 중이에요." },
    { id: "letters", emoji: "💌", label: "우리에게 온 편지", teaser: "편지함은 아직 비어있어요. 곧 열려요." },
    { id: "memories", emoji: "📖", label: "우리만의 이야기", teaser: "책장에 우리 이야기가 채워질 예정이에요." },
    { id: "places", emoji: "🌏", label: "우리가 함께한 곳", teaser: "함께 갔던 곳들, 곧 지구본에 표시돼요." },
    { id: "report", emoji: "✨", label: "모임 리포트", teaser: "우리 모임 리포트, 곧 화면에 켜져요." },
  ];
}

export default function RoomScene({ slug }: { slug: string }) {
  const router = useRouter();
  const HOTSPOTS = buildHotspots(slug);
  const [active, setActive] = useState<Hotspot | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePick = (h: Hotspot) => {
    if (h.href) {
      router.push(h.href);
      return;
    }
    setActive(h);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActive(null), 2600);
  };

  const byId = (id: string) => HOTSPOTS.find((h) => h.id === id)!;

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

          {/* 창문 (거울 액자와 겹치지 않도록 위쪽 여백에 배치) */}
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
            className="hotspot"
            onClick={() => handlePick(byId("personality"))}
            role="button"
            aria-label={byId("personality").label}
          >
            <ellipse cx="70" cy="72" rx="30" ry="33" fill="var(--frame)" />
            <ellipse cx="70" cy="72" rx="22" ry="25" fill="var(--glass)" />
            <text x="70" y="81" textAnchor="middle" fontSize="26">🎭</text>
          </g>

          {/* 하트 액자: 궁합 */}
          <g
            className="hotspot"
            onClick={() => handlePick(byId("compatibility"))}
            role="button"
            aria-label={byId("compatibility").label}
          >
            <rect x="130" y="42" width="60" height="56" rx="6" fill="var(--frame)" />
            <rect x="136" y="48" width="48" height="44" rx="3" fill="var(--cream)" />
            <text x="160" y="79" textAnchor="middle" fontSize="24">❤️</text>
          </g>

          {/* 리본 액자: 역할 */}
          <g
            className="hotspot"
            onClick={() => handlePick(byId("roles"))}
            role="button"
            aria-label={byId("roles").label}
          >
            <rect x="220" y="42" width="60" height="56" rx="6" fill="var(--frame)" />
            <rect x="226" y="48" width="48" height="44" rx="3" fill="var(--cream)" />
            <text x="250" y="79" textAnchor="middle" fontSize="24">🎉</text>
          </g>

          {/* 코르크보드: 서로의 생각 */}
          <g
            className="hotspot"
            onClick={() => handlePick(byId("questions"))}
            role="button"
            aria-label={byId("questions").label}
          >
            <rect x="310" y="42" width="60" height="56" rx="4" fill="var(--door-dark)" />
            <rect x="317" y="49" width="20" height="16" fill="var(--cream)" transform="rotate(-4 327 57)" />
            <rect x="343" y="52" width="20" height="16" fill="var(--butter)" transform="rotate(5 353 60)" />
            <text x="340" y="88" textAnchor="middle" fontSize="22">👀</text>
          </g>

          {/* --- 바닥 가구 4종 --- */}
          {/* 우체통: 편지 */}
          <g
            className="hotspot"
            onClick={() => handlePick(byId("letters"))}
            role="button"
            aria-label={byId("letters").label}
          >
            <rect x="52" y="222" width="6" height="48" fill="var(--roof)" />
            <rect x="32" y="196" width="44" height="30" rx="6" fill="var(--coral)" />
            <rect x="32" y="196" width="44" height="9" rx="4" fill="var(--door-dark)" />
            <text x="54" y="217" textAnchor="middle" fontSize="18">💌</text>
          </g>

          {/* 책장: 이야기 */}
          <g
            className="hotspot"
            onClick={() => handlePick(byId("memories"))}
            role="button"
            aria-label={byId("memories").label}
          >
            <rect x="118" y="188" width="68" height="72" rx="3" fill="var(--door-dark)" />
            <rect x="124" y="194" width="56" height="60" fill="var(--wall)" />
            <rect x="124" y="224" width="56" height="2.5" fill="var(--door-dark)" opacity="0.4" />
            <text x="152" y="214" textAnchor="middle" fontSize="22">📖</text>
            <rect x="130" y="230" width="8" height="22" fill="var(--coral)" />
            <rect x="141" y="226" width="8" height="26" fill="var(--mint)" />
            <rect x="152" y="232" width="8" height="20" fill="var(--butter)" />
            <rect x="163" y="228" width="8" height="24" fill="var(--frame)" />
          </g>

          {/* 지구본: 함께한 곳 */}
          <g
            className="hotspot"
            onClick={() => handlePick(byId("places"))}
            role="button"
            aria-label={byId("places").label}
          >
            <ellipse cx="250" cy="270" rx="24" ry="6" fill="var(--door-dark)" opacity="0.85" />
            <rect x="244" y="246" width="12" height="24" fill="var(--door-dark)" />
            <text x="250" y="240" textAnchor="middle" fontSize="34">🌏</text>
          </g>

          {/* TV: 리포트 */}
          <g
            className="hotspot"
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
            <text x="342" y="219" textAnchor="middle" fontSize="16">✨</text>
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
      </div>

      <div className="mt-3 min-h-[52px]">
        {active && (
          <div className="card animate-pop-in flex items-center gap-2 border border-black/5 px-4 py-3">
            <span className="text-xl">{active.emoji}</span>
            <div>
              <p className="text-sm font-bold text-[var(--ink)]">{active.label}</p>
              <p className="text-xs text-[var(--ink-soft)]">{active.teaser}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
