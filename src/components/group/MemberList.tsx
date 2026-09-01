import type { MemberSummary } from "@/lib/group";

export default function MemberList({
  members,
  currentMemberId,
}: {
  members: MemberSummary[];
  currentMemberId: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {members.map((m) => (
        <div
          key={m.id}
          className="card flex items-center gap-1.5 border border-black/5 py-1.5 pl-1.5 pr-3"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--butter)]/60 text-sm">
            {m.name.slice(0, 1)}
          </span>
          <span className="text-sm font-bold text-[var(--ink)]">
            {m.name}
            {m.id === currentMemberId && (
              <span className="ml-1 font-normal text-[var(--ink-soft)]">
                (나)
              </span>
            )}
          </span>
          {m.isOwner && <span className="text-xs">👑</span>}
        </div>
      ))}
    </div>
  );
}
