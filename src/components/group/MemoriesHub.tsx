"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteMemoryAction, type DeleteMemoryState } from "@/app/actions/memories";
import MemoryComposer from "./MemoryComposer";
import EmptyState from "./EmptyState";

export type MemoryView = {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  photoDataUrl: string | null;
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

function DeleteButton({ slug, memoryId }: { slug: string; memoryId: string }) {
  const initial: DeleteMemoryState = { status: "idle" };
  const [state, formAction] = useActionState(deleteMemoryAction, initial);
  return (
    <form action={formAction}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="memoryId" value={memoryId} />
      <DeleteSubmitButton />
      {state.status === "error" && (
        <p className="mt-1 text-xs font-medium text-red-500">{state.error}</p>
      )}
    </form>
  );
}

export default function MemoriesHub({
  slug,
  memories,
  currentMemberId,
}: {
  slug: string;
  memories: MemoryView[];
  currentMemberId: string;
}) {
  const [writing, setWriting] = useState(memories.length === 0);

  return (
    <div className="flex flex-col gap-4">
      {writing ? (
        <div>
          <MemoryComposer slug={slug} />
          {memories.length > 0 && (
            <button
              type="button"
              onClick={() => setWriting(false)}
              className="mt-2 text-xs text-[var(--ink-soft)] underline underline-offset-4"
            >
              취소
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setWriting(true)}
          className="btn-primary w-full py-3.5"
        >
          + 이야기 남기기
        </button>
      )}

      {memories.length === 0 ? (
        <EmptyState emoji="✨" title="첫 번째 이야기를 남겨주세요" subtitle="우리 모임의 기억에 남는 순간을 적어보세요." />
      ) : (
        <div className="flex flex-col gap-3">
          {memories.map((m) => (
            <div key={m.id} className="card animate-fade-in-up border border-black/5 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[var(--ink)]">{m.authorName}</p>
                <p className="text-xs text-[var(--ink-soft)]">{m.createdAtLabel}</p>
              </div>
              {m.photoDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photoDataUrl}
                  alt="추억 사진"
                  className="mt-2 max-h-72 w-full rounded-xl object-cover"
                />
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink)]">{m.text}</p>
              {m.authorId === currentMemberId && (
                <div className="mt-2">
                  <DeleteButton slug={slug} memoryId={m.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
