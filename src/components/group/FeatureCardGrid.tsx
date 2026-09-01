const FEATURES = [
  { emoji: "🎭", label: "우리들의 성향" },
  { emoji: "❤️", label: "우리 궁합" },
  { emoji: "🎉", label: "우리들의 역할" },
  { emoji: "👀", label: "서로의 생각" },
  { emoji: "💌", label: "우리에게 온 편지" },
  { emoji: "📖", label: "우리만의 이야기" },
  { emoji: "🌏", label: "우리가 함께한 곳" },
  { emoji: "✨", label: "모임 리포트" },
] as const;

export default function FeatureCardGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FEATURES.map((f) => (
        <div
          key={f.label}
          className="card relative flex flex-col items-center gap-1 border border-black/5 px-3 py-6 text-center opacity-80"
        >
          <span className="absolute right-2 top-2 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-[var(--ink-soft)]">
            곧 만나요
          </span>
          <span className="text-2xl">{f.emoji}</span>
          <span className="mt-1 text-sm font-bold text-[var(--ink)]">
            {f.label}
          </span>
        </div>
      ))}
    </div>
  );
}
