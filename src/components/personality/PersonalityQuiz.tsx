"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitPersonalityAction,
  type SubmitPersonalityState,
} from "@/app/actions/personality";
import { PERSONALITY_QUESTIONS } from "@/lib/personality";

const initialState: SubmitPersonalityState = { status: "idle" };

function SubmitFallbackButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-4">
      {pending ? "결과 계산 중..." : "결과 보기"}
    </button>
  );
}

export default function PersonalityQuiz({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(submitPersonalityAction, initialState);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(PERSONALITY_QUESTIONS.length).fill(null)
  );
  const formRef = useRef<HTMLFormElement>(null);

  const question = PERSONALITY_QUESTIONS[step];
  const isLast = step === PERSONALITY_QUESTIONS.length - 1;
  const progress = Math.round(((step + 1) / PERSONALITY_QUESTIONS.length) * 100);

  const handlePick = (key: string) => {
    const next = [...answers];
    next[step] = key;
    setAnswers(next);

    window.setTimeout(() => {
      if (isLast) {
        formRef.current?.requestSubmit();
      } else {
        setStep((s) => s + 1);
      }
    }, 250);
  };

  return (
    <div>
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full rounded-full bg-[var(--coral)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mb-1 text-xs font-bold text-[var(--ink-soft)]">
        {step + 1} / {PERSONALITY_QUESTIONS.length}
      </p>
      <h2 className="font-heading text-xl leading-snug text-[var(--ink)]">
        {question.text}
      </h2>

      <div className="mt-5 flex flex-col gap-2.5">
        {question.options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => handlePick(opt.key)}
            className={`card animate-fade-in-up flex items-center gap-3 border px-4 py-3.5 text-left transition active:scale-[0.98] ${
              answers[step] === opt.key
                ? "border-2 border-[var(--coral)]"
                : "border-black/5"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--butter)]/50 text-xs font-bold text-[var(--ink)]">
              {opt.key}
            </span>
            <span className="text-sm text-[var(--ink)]">{opt.text}</span>
          </button>
        ))}
      </div>

      <form ref={formRef} action={formAction} className="hidden">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="answers" value={answers.join(",")} />
        <SubmitFallbackButton />
      </form>

      {state.status === "error" && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
          {state.error}
        </p>
      )}
    </div>
  );
}
