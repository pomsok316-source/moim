export default function EmptyState({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-2 border border-black/5 px-6 py-10 text-center">
      <span className="text-3xl">{emoji}</span>
      <p className="font-bold text-[var(--ink)]">{title}</p>
      {subtitle && (
        <p className="text-sm text-[var(--ink-soft)]">{subtitle}</p>
      )}
    </div>
  );
}
