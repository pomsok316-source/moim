"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { sendLetterAction, type SendLetterState } from "@/app/actions/letters";
import { LETTER_MESSAGE_MAX_LENGTH, LETTER_PROMPTS } from "@/lib/letters";

const initialState: SendLetterState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
      {pending ? "보내는 중..." : "편지 보내기 💌"}
    </button>
  );
}

export default function LetterComposer({
  slug,
  members,
}: {
  slug: string;
  members: { id: string; name: string }[];
}) {
  const [state, formAction] = useActionState(sendLetterAction, initialState);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [promptId, setPromptId] = useState<string | null>(null);

  const recipient = members.find((m) => m.id === recipientId);

  if (!recipient) {
    return (
      <div className="card border border-black/5 p-5">
        <p className="mb-3 text-sm font-bold text-[var(--ink)]">
          누구에게 편지를 쓸까요?
        </p>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setRecipientId(m.id)}
              className="card flex items-center gap-1.5 border border-black/5 py-2 pl-2 pr-4 text-sm font-bold text-[var(--ink)] transition active:scale-95"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--butter)]/60 text-sm">
                {m.name.slice(0, 1)}
              </span>
              {m.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="card flex flex-col gap-4 border border-black/5 p-5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="recipientId" value={recipient.id} />
      <input type="hidden" name="promptId" value={promptId ?? ""} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--ink)]">
          💌 {recipient.name}님에게
        </p>
        <button
          type="button"
          onClick={() => setRecipientId(null)}
          className="text-xs text-[var(--ink-soft)] underline underline-offset-4"
        >
          다른 사람 선택
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {LETTER_PROMPTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPromptId((cur) => (cur === p.id ? null : p.id))}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              promptId === p.id
                ? "border-[var(--coral)] bg-[var(--coral)]/10 text-[var(--coral-dark)]"
                : "border-black/10 text-[var(--ink-soft)]"
            }`}
          >
            {p.label(recipient.name)}
          </button>
        ))}
      </div>

      <textarea
        name="message"
        required
        maxLength={LETTER_MESSAGE_MAX_LENGTH}
        rows={6}
        placeholder={`${recipient.name}님에게 하고 싶은 말을 편하게 적어보세요.`}
        className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--coral)]"
      />

      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
