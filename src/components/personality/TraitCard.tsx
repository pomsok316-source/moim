export default function TraitCard({
  emoji,
  eyebrow,
  title,
  desc,
  tone = "coral",
}: {
  emoji: string;
  eyebrow?: string;
  title: string;
  desc: string;
  tone?: "coral" | "sky";
}) {
  return (
    <div
      className={`animate-pop-in rounded-2xl p-6 text-center ${
        tone === "sky" ? "sky-card" : "card border border-black/5"
      }`}
    >
      {eyebrow && (
        <p
          className={`text-xs font-bold ${
            tone === "sky" ? "text-[var(--ink)]/70" : "text-[var(--coral-dark)]"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <p className="mt-1 text-4xl">{emoji}</p>
      <p className="font-heading mt-2 text-2xl text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{desc}</p>
    </div>
  );
}
