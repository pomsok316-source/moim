"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { voteAction, type VoteState, type TallyEntry } from "@/app/actions/questions";

function SubmitButton({ name, onClick }: { name: string; onClick: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={pending}
      className="card w-full border border-black/5 px-4 py-2.5 text-left text-sm font-bold text-[var(--ink)] transition active:scale-[0.98] disabled:opacity-50"
    >
      {name}
    </button>
  );
}

export default function QuestionVoteCard({
  slug,
  questionId,
  emoji,
  text,
  members,
  initialMyTargetId,
  initialTally,
}: {
  slug: string;
  questionId: string;
  emoji: string;
  text: string;
  members: { id: string; name: string }[];
  initialMyTargetId: string | null;
  initialTally: TallyEntry[];
}) {
  const initialState: VoteState = initialMyTargetId
    ? { status: "success", myTargetId: initialMyTargetId, tally: initialTally }
    : { status: "idle" };
  const [state, formAction] = useActionState(voteAction, initialState);
  const [editing, setEditing] = useState(false);

  const voted = state.status === "success";
  const showPicker = !voted || editing;

  return (
    <div className="card border border-black/5 p-4">
      <p className="text-sm font-bold text-[var(--ink)]">
        {emoji} {text}
      </p>

      {showPicker ? (
        <div className="mt-3 flex flex-col gap-2">
          {members.map((m) => (
            <form key={m.id} action={formAction}>
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="questionId" value={questionId} />
              <input type="hidden" name="targetId" value={m.id} />
              <SubmitButton name={m.name} onClick={() => setEditing(false)} />
            </form>
          ))}
          {state.status === "error" && (
            <p className="text-xs font-medium text-red-500">{state.error}</p>
          )}
        </div>
      ) : (
        <div className="mt-3">
          {(() => {
            const top = state.tally[0]?.count ?? 0;
            const winners = state.tally.filter((t) => t.count === top);
            return (
              <p className="text-sm text-[var(--ink)]">
                🥇{" "}
                <span className="font-bold">
                  {winners.map((w) => w.name).join(", ")}
                </span>{" "}
                — {top}표
              </p>
            );
          })()}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-2 text-xs text-[var(--ink-soft)] underline underline-offset-4"
          >
            다시 투표하기
          </button>
        </div>
      )}
    </div>
  );
}
