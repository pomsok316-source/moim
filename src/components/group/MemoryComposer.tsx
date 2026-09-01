"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addMemoryAction, type AddMemoryState } from "@/app/actions/memories";
import { MEMORY_TEXT_MAX_LENGTH } from "@/lib/memories";
import { resizeImageToDataUrl } from "@/lib/imageResize";

const initialState: AddMemoryState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
      {pending ? "남기는 중..." : "이야기 남기기 ✨"}
    </button>
  );
}

export default function MemoryComposer({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(addMemoryAction, initialState);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setPhotoDataUrl(dataUrl);
    } catch {
      setPhotoDataUrl(null);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form action={formAction} className="card flex flex-col gap-3 border border-black/5 p-5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="photo" value={photoDataUrl ?? ""} />

      <p className="text-sm font-bold text-[var(--ink)]">
        우리 모임에서 가장 기억에 남는 순간은?
      </p>

      <textarea
        name="text"
        required
        maxLength={MEMORY_TEXT_MAX_LENGTH}
        rows={4}
        placeholder="예: 제주도에서 새벽 3시에 편의점 갔던 날"
        className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--coral)]"
      />

      {photoDataUrl ? (
        <div className="relative w-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photoDataUrl} alt="첨부 사진" className="h-32 w-32 rounded-2xl object-cover" />
          <button
            type="button"
            onClick={() => {
              setPhotoDataUrl(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white"
            aria-label="사진 제거"
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="card flex w-32 flex-col items-center justify-center gap-1 border border-dashed border-black/15 py-6 text-xs text-[var(--ink-soft)]">
          <span className="text-xl">📷</span>
          {processing ? "처리 중..." : "사진 추가"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      )}

      {state.status === "error" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
