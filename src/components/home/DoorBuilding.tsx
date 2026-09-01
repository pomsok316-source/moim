export default function DoorBuilding() {
  const flagColors = ["var(--coral)", "var(--mint)", "var(--butter)"];

  return (
    <svg
      viewBox="0 0 200 220"
      className="h-full w-full"
      role="img"
      aria-label="아기자기한 302호 아파트 건물 일러스트"
    >
      {/* 밤하늘 반짝이는 별 */}
      <rect x="35" y="20" width="5" height="5" fill="var(--butter)" className="animate-twinkle" />
      <rect
        x="155"
        y="15"
        width="4"
        height="4"
        fill="var(--coral)"
        className="animate-twinkle"
        style={{ animationDelay: "0.6s" }}
      />
      <rect
        x="100"
        y="6"
        width="4"
        height="4"
        fill="var(--mint)"
        className="animate-twinkle"
        style={{ animationDelay: "1.1s" }}
      />

      {/* 지붕 */}
      <polygon points="15,72 185,72 160,40 40,40" fill="var(--bldg-roof)" />
      <polygon points="40,40 160,40 155,44 45,44" fill="var(--cream)" opacity="0.35" />
      <polygon points="15,72 185,72 178,68 22,68" fill="#000000" opacity="0.08" />

      {/* 처마 아래 파티 깃발 */}
      <line x1="16" y1="75" x2="184" y2="75" stroke="var(--ink-soft)" strokeWidth="1.5" opacity="0.4" />
      {[25, 46, 67, 88, 112, 133, 154, 175].map((x, i) => (
        <polygon
          key={x}
          points={`${x - 6},75 ${x + 6},75 ${x},85`}
          fill={flagColors[i % flagColors.length]}
        />
      ))}

      {/* 건물 몸체 */}
      <rect x="25" y="85" width="150" height="125" fill="var(--bldg-wall)" />

      {/* 창문 2x3 + 화단 */}
      {[
        { x: 45, y: 100, lit: false },
        { x: 95, y: 100, lit: true },
        { x: 145, y: 100, lit: false },
        { x: 45, y: 138, lit: true },
        { x: 95, y: 138, lit: false },
        { x: 145, y: 138, lit: true },
      ].map((w) => (
        <g key={`${w.x}-${w.y}`}>
          <rect
            x={w.x}
            y={w.y}
            width="24"
            height="24"
            rx="2"
            fill={w.lit ? "var(--window-lit)" : "var(--window-dark)"}
          />
          <rect x={w.x + 11} y={w.y} width="2" height="24" fill="var(--cream)" opacity="0.6" />
          <rect x={w.x} y={w.y + 11} width="24" height="2" fill="var(--cream)" opacity="0.6" />
          {w.y === 138 && (
            <>
              <rect x={w.x - 2} y="163" width="28" height="6" rx="2" fill="var(--bldg-roof)" />
              <circle cx={w.x + 3} cy="162" r="2.5" fill="var(--coral)" />
              <circle cx={w.x + 12} cy="161" r="2.5" fill="var(--cream)" />
              <circle cx={w.x + 21} cy="162" r="2.5" fill="var(--mint)" />
            </>
          )}
        </g>
      ))}

      {/* 차양 */}
      <rect x="76" y="150" width="48" height="12" rx="3" fill="var(--coral)" />
      <rect x="80" y="155" width="40" height="3" fill="var(--cream)" opacity="0.8" />

      {/* 문 */}
      <rect x="82" y="160" width="36" height="50" rx="4" fill="var(--coral-dark)" />
      <rect x="86" y="164" width="28" height="42" rx="3" fill="var(--coral)" />
      <circle cx="110" cy="187" r="2.5" fill="var(--bldg-roof)" />

      {/* 명패 */}
      <rect x="89" y="170" width="22" height="15" rx="2" fill="var(--cream)" />
      <text
        x="100"
        y="181"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fontFamily="var(--font-body), monospace"
        fill="var(--ink)"
      >
        302
      </text>

      {/* 화분 */}
      <polygon points="140,205 152,205 149,193 143,193" fill="var(--bldg-roof)" />
      <ellipse cx="146" cy="190" rx="4" ry="6" fill="var(--mint)" />
      <ellipse cx="141" cy="193" rx="3.5" ry="5" fill="var(--mint)" />
      <ellipse cx="151" cy="193" rx="3.5" ry="5" fill="var(--mint)" />

      {/* 웰컴 매트 그림자 */}
      <ellipse cx="100" cy="214" rx="34" ry="6" fill="var(--butter)" opacity="0.55" />
    </svg>
  );
}
