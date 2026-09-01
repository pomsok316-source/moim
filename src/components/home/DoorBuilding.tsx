export default function DoorBuilding() {
  return (
    <svg
      viewBox="0 0 200 220"
      className="h-full w-full"
      role="img"
      aria-label="문이 달린 작은 아파트 302호 일러스트"
    >
      {/* 반짝이는 작은 별 */}
      <rect x="58" y="53" width="5" height="5" fill="var(--butter)" className="animate-twinkle" />
      <rect
        x="148"
        y="48"
        width="4"
        height="4"
        fill="var(--coral)"
        className="animate-twinkle"
        style={{ animationDelay: "0.6s" }}
      />
      <rect
        x="98"
        y="26"
        width="4"
        height="4"
        fill="var(--mint)"
        className="animate-twinkle"
        style={{ animationDelay: "1.1s" }}
      />

      {/* 지붕 */}
      <polygon points="15,72 185,72 160,40 40,40" fill="var(--roof)" />

      {/* 건물 몸체 */}
      <rect x="25" y="70" width="150" height="140" fill="var(--brick)" />

      {/* 창문 2x3 */}
      {[
        { x: 45, y: 90, lit: false },
        { x: 95, y: 90, lit: true },
        { x: 145, y: 90, lit: false },
        { x: 45, y: 130, lit: true },
        { x: 95, y: 130, lit: false },
        { x: 145, y: 130, lit: true },
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
        </g>
      ))}

      {/* 차양 */}
      <rect x="76" y="140" width="48" height="12" rx="3" fill="var(--coral)" />
      <rect x="80" y="145" width="40" height="3" fill="var(--cream)" opacity="0.8" />

      {/* 문 */}
      <rect x="82" y="150" width="36" height="60" rx="3" fill="var(--door-dark)" />
      <rect x="86" y="154" width="28" height="52" rx="2" fill="var(--door)" />
      <circle cx="110" cy="185" r="2.5" fill="var(--roof)" />

      {/* 명패 */}
      <rect x="89" y="160" width="22" height="15" rx="2" fill="var(--cream)" />
      <text
        x="100"
        y="171"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fontFamily="var(--font-body), monospace"
        fill="var(--ink)"
      >
        302
      </text>

      {/* 화분 */}
      <polygon points="140,205 152,205 149,193 143,193" fill="var(--door-dark)" />
      <ellipse cx="146" cy="190" rx="4" ry="6" fill="var(--mint)" />
      <ellipse cx="141" cy="193" rx="3.5" ry="5" fill="var(--mint)" />
      <ellipse cx="151" cy="193" rx="3.5" ry="5" fill="var(--mint)" />

      {/* 웰컴 매트 그림자 */}
      <ellipse cx="100" cy="214" rx="34" ry="6" fill="var(--butter)" opacity="0.55" />
    </svg>
  );
}
