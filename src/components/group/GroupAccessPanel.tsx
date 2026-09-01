"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  joinNewMemberAction,
  loginWithPinAction,
  type JoinGroupState,
  type LoginState,
} from "@/app/actions";
import { MEMBER_NAME_MAX_LENGTH, PIN_LENGTH } from "@/lib/group";
import type { MemberSummary } from "@/lib/group";

const joinInitial: JoinGroupState = { status: "idle" };
const loginInitial: LoginState = { status: "idle" };

function PinInput({
  name,
  label,
  autoFocus,
}: {
  name: string;
  label: string;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-[var(--ink)]">{label}</label>
      <input
        name={name}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        required
        maxLength={PIN_LENGTH}
        autoFocus={autoFocus}
        placeholder="••••"
        className="card mt-2 w-full border border-black/5 px-4 py-3 text-center text-2xl tracking-[0.6em] outline-none focus:border-[var(--coral)]"
      />
    </div>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary flex w-full items-center justify-center py-4 text-lg"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function LoginForm({ slug, member, onBack }: { slug: string; member: MemberSummary; onBack: () => void }) {
  const [state, formAction] = useActionState(loginWithPinAction, loginInitial);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="memberId" value={member.id} />
      <p className="text-sm text-[var(--ink-soft)]">
        <span className="font-bold text-[var(--ink)]">{member.name}</span>님, PIN을
        입력해주세요.
      </p>
      <PinInput name="pin" label="PIN 4자리" autoFocus />
      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
          {state.error}
        </p>
      )}
      <SubmitButton label="들어가기" pendingLabel="확인하는 중..." />
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-[var(--ink-soft)] underline underline-offset-4"
      >
        다른 이름 선택하기
      </button>
    </form>
  );
}

function NewMemberForm({ slug, hasOtherOption, onSwitch }: { slug: string; hasOtherOption: boolean; onSwitch: () => void }) {
  const [state, formAction] = useActionState(joinNewMemberAction, joinInitial);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <div>
        <label htmlFor="name" className="text-sm font-bold text-[var(--ink)]">
          이름(닉네임)
        </label>
        <input
          id="name"
          name="name"
          required
          autoFocus
          maxLength={MEMBER_NAME_MAX_LENGTH}
          placeholder="모임에서 나를 부르는 이름"
          className="card mt-2 w-full border border-black/5 px-4 py-3 text-base outline-none focus:border-[var(--coral)]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PinInput name="pin" label="PIN 4자리" />
        <PinInput name="pinConfirm" label="PIN 확인" />
      </div>
      <p className="text-xs text-[var(--ink-soft)]">
        다른 기기나 브라우저로 다시 들어올 때, 이름과 이 PIN으로 로그인해요.
      </p>
      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
          {state.error}
        </p>
      )}
      <SubmitButton label="참여하기" pendingLabel="참여하는 중..." />
      {hasOtherOption && (
        <button
          type="button"
          onClick={onSwitch}
          className="text-sm text-[var(--ink-soft)] underline underline-offset-4"
        >
          이미 참여했어요? 기존 이름으로 들어가기
        </button>
      )}
    </form>
  );
}

export default function GroupAccessPanel({
  slug,
  members,
}: {
  slug: string;
  members: MemberSummary[];
}) {
  const [mode, setMode] = useState<"select" | "new">(
    members.length > 0 ? "select" : "new"
  );
  const [selected, setSelected] = useState<MemberSummary | null>(null);

  if (mode === "new") {
    return (
      <NewMemberForm
        slug={slug}
        hasOtherOption={members.length > 0}
        onSwitch={() => setMode("select")}
      />
    );
  }

  if (selected) {
    return (
      <LoginForm slug={slug} member={selected} onBack={() => setSelected(null)} />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--ink-soft)]">
        내 이름을 찾아 눌러주세요.
      </p>
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelected(m)}
            className="card flex items-center gap-1.5 border border-black/5 py-2 pl-2 pr-4 text-sm font-bold text-[var(--ink)] transition active:scale-95"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--butter)]/60 text-sm">
              {m.name.slice(0, 1)}
            </span>
            {m.name}
            {m.isOwner && <span className="text-xs">👑</span>}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setMode("new")}
        className="text-sm text-[var(--ink-soft)] underline underline-offset-4"
      >
        처음이에요, 새로 참여할게요
      </button>
    </div>
  );
}
