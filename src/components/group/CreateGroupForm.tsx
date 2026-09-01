"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createGroupAction, type CreateGroupState } from "@/app/actions";
import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_ICONS,
  GROUP_NAME_MAX_LENGTH,
  GROUP_TYPES,
  MEMBER_NAME_MAX_LENGTH,
  MEMBER_TARGET_MAX,
  MEMBER_TARGET_MIN,
  PIN_LENGTH,
} from "@/lib/group";

const initialState: CreateGroupState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary sticky bottom-4 mt-2 flex w-full items-center justify-center py-4 text-lg"
    >
      {pending ? "만드는 중..." : "우리 모임 만들기 🎉"}
    </button>
  );
}

export default function CreateGroupForm() {
  const [state, formAction] = useActionState(createGroupAction, initialState);
  const [typeId, setTypeId] = useState(GROUP_TYPES[0].id);
  const [icon, setIcon] = useState(GROUP_ICONS[0]);
  const [memberTarget, setMemberTarget] = useState(4);

  return (
    <form action={formAction} className="flex flex-col gap-7">
      <section>
        <label
          htmlFor="name"
          className="text-sm font-bold text-[var(--ink)]"
        >
          모임 이름
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={GROUP_NAME_MAX_LENGTH}
          placeholder="예: 302호, 우리 넷, 10년지기"
          className="card mt-2 w-full border border-black/5 px-4 py-3 text-base outline-none focus:border-[var(--coral)]"
        />
      </section>

      <section>
        <p className="text-sm font-bold text-[var(--ink)]">모임 유형</p>
        <input type="hidden" name="typeId" value={typeId} />
        <div className="mt-2 grid grid-cols-4 gap-2">
          {GROUP_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTypeId(t.id)}
              className={`card flex flex-col items-center gap-1 py-3 text-xs font-bold transition ${
                typeId === t.id
                  ? "border-2 border-[var(--coral)] text-[var(--coral-dark)]"
                  : "border border-black/5 text-[var(--ink-soft)]"
              }`}
            >
              <span className="text-xl">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm font-bold text-[var(--ink)]">대표 아이콘</p>
        <input type="hidden" name="icon" value={icon} />
        <div className="card mt-2 grid grid-cols-8 gap-1 border border-black/5 p-2">
          {GROUP_ICONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setIcon(e)}
              aria-label={`아이콘 ${e}`}
              className={`flex items-center justify-center rounded-xl py-2 text-xl transition ${
                icon === e ? "bg-[var(--butter)]/60" : "hover:bg-black/5"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm font-bold text-[var(--ink)]">예상 인원</p>
        <input type="hidden" name="memberTarget" value={memberTarget} />
        <div className="card mt-2 flex items-center justify-between border border-black/5 px-4 py-3">
          <button
            type="button"
            onClick={() =>
              setMemberTarget((v) => Math.max(MEMBER_TARGET_MIN, v - 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-lg font-bold"
          >
            −
          </button>
          <span className="text-lg font-bold">{memberTarget}명</span>
          <button
            type="button"
            onClick={() =>
              setMemberTarget((v) => Math.min(MEMBER_TARGET_MAX, v + 1))
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-lg font-bold"
          >
            +
          </button>
        </div>
      </section>

      <section>
        <label
          htmlFor="description"
          className="text-sm font-bold text-[var(--ink)]"
        >
          모임 소개 <span className="font-normal text-[var(--ink-soft)]">(선택)</span>
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={GROUP_DESCRIPTION_MAX_LENGTH}
          rows={2}
          placeholder="예: 대학교 때부터 5년째 함께하고 있는 친구들"
          className="card mt-2 w-full resize-none border border-black/5 px-4 py-3 text-base outline-none focus:border-[var(--coral)]"
        />
      </section>

      <section>
        <label
          htmlFor="creatorName"
          className="text-sm font-bold text-[var(--ink)]"
        >
          내 이름(닉네임)
        </label>
        <input
          id="creatorName"
          name="creatorName"
          required
          maxLength={MEMBER_NAME_MAX_LENGTH}
          placeholder="모임에서 나를 부르는 이름"
          className="card mt-2 w-full border border-black/5 px-4 py-3 text-base outline-none focus:border-[var(--coral)]"
        />
      </section>

      <section>
        <p className="text-sm font-bold text-[var(--ink)]">
          PIN 4자리 설정
        </p>
        <p className="mt-1 text-xs text-[var(--ink-soft)]">
          다른 기기나 브라우저로 다시 들어올 때, 이름과 이 PIN으로 로그인해요.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <input
            name="pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            maxLength={PIN_LENGTH}
            placeholder="••••"
            aria-label="PIN 4자리"
            className="card w-full border border-black/5 px-4 py-3 text-center text-2xl tracking-[0.6em] outline-none focus:border-[var(--coral)]"
          />
          <input
            name="pinConfirm"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            maxLength={PIN_LENGTH}
            placeholder="••••"
            aria-label="PIN 확인"
            className="card w-full border border-black/5 px-4 py-3 text-center text-2xl tracking-[0.6em] outline-none focus:border-[var(--coral)]"
          />
        </div>
      </section>

      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
