"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteLetterAction, type DeleteLetterState } from "@/app/actions/letters";
import LetterComposer from "./LetterComposer";
import EmptyState from "./EmptyState";

export type LetterView = {
  id: string;
  senderName: string;
  recipientName: string;
  promptLabel: string | null;
  message: string;
  createdAtLabel: string;
};

function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs text-[var(--ink-soft)] underline underline-offset-4"
    >
      {pending ? "삭제하는 중..." : "삭제"}
    </button>
  );
}

function DeleteButton({ slug, letterId }: { slug: string; letterId: string }) {
  const initial: DeleteLetterState = { status: "idle" };
  const [state, formAction] = useActionState(deleteLetterAction, initial);
  return (
    <form action={formAction}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="letterId" value={letterId} />
      <DeleteSubmitButton />
      {state.status === "error" && (
        <p className="mt-1 text-xs font-medium text-red-500">{state.error}</p>
      )}
    </form>
  );
}

function LetterCard({
  letter,
  nameLine,
  showDelete,
  slug,
}: {
  letter: LetterView;
  nameLine: string;
  showDelete?: boolean;
  slug: string;
}) {
  return (
    <div className="card animate-fade-in-up border border-black/5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--ink)]">{nameLine}</p>
        <p className="text-xs text-[var(--ink-soft)]">{letter.createdAtLabel}</p>
      </div>
      {letter.promptLabel && (
        <p className="mt-1 text-xs font-bold text-[var(--coral-dark)]">
          💌 {letter.promptLabel}
        </p>
      )}
      <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink)]">
        {letter.message}
      </p>
      {showDelete && (
        <div className="mt-2">
          <DeleteButton slug={slug} letterId={letter.id} />
        </div>
      )}
    </div>
  );
}

export default function LettersHub({
  slug,
  members,
  received,
  sent,
  initialTab = "inbox",
  justSent = false,
}: {
  slug: string;
  members: { id: string; name: string }[];
  received: LetterView[];
  sent: LetterView[];
  initialTab?: "inbox" | "sent" | "write";
  justSent?: boolean;
}) {
  const [tab, setTab] = useState<"inbox" | "sent" | "write">(initialTab);

  return (
    <div>
      {justSent && (
        <div className="card animate-pop-in mb-4 border border-[var(--coral)]/30 bg-[var(--coral)]/10 px-4 py-3 text-center text-sm font-bold text-[var(--coral-dark)]">
          편지를 보냈어요 💌
        </div>
      )}

      <div className="mb-4 flex gap-2 rounded-full bg-black/5 p-1">
        {(
          [
            ["inbox", `받은 편지 ${received.length}`],
            ["sent", `보낸 편지 ${sent.length}`],
            ["write", "편지 쓰기"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
              tab === key
                ? "bg-white text-[var(--coral-dark)] shadow-sm"
                : "text-[var(--ink-soft)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "inbox" &&
        (received.length === 0 ? (
          <EmptyState emoji="💌" title="아직 도착한 편지가 없어요" subtitle="친구들이 곧 편지를 보내올 거예요." />
        ) : (
          <div className="flex flex-col gap-3">
            {received.map((l) => (
              <LetterCard key={l.id} slug={slug} letter={l} nameLine={`From. ${l.senderName}`} />
            ))}
          </div>
        ))}

      {tab === "sent" &&
        (sent.length === 0 ? (
          <EmptyState emoji="📮" title="아직 보낸 편지가 없어요" subtitle="친구에게 먼저 편지를 보내보세요." />
        ) : (
          <div className="flex flex-col gap-3">
            {sent.map((l) => (
              <LetterCard
                key={l.id}
                slug={slug}
                letter={l}
                nameLine={`To. ${l.recipientName}`}
                showDelete
              />
            ))}
          </div>
        ))}

      {tab === "write" &&
        (members.length === 0 ? (
          <EmptyState emoji="🥹" title="아직 편지 쓸 친구가 없어요" subtitle="친구들을 먼저 초대해보세요." />
        ) : (
          <LetterComposer slug={slug} members={members} />
        ))}
    </div>
  );
}
