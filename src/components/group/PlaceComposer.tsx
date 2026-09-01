"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { addPlaceAction, type AddPlaceState } from "@/app/actions/places";
import { PLACE_DESCRIPTION_MAX_LENGTH, PLACE_NAME_MAX_LENGTH } from "@/lib/places";
import { resizeImageToDataUrl } from "@/lib/photo";

const initialState: AddPlaceState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
      {pending ? "남기는 중..." : "장소 남기기 📍"}
    </button>
  );
}

export default function PlaceComposer({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(addPlaceAction, initialState);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      setPhotoDataUrl(await resizeImageToDataUrl(file));
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

      <div>
        <label className="text-sm font-bold text-[var(--ink)]">장소 이름</label>
        <input
          name="placeName"
          required
          maxLength={PLACE_NAME_MAX_LENGTH}
          placeholder="예: 제주도"
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--coral)]"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-[var(--ink)]">
          날짜 <span className="font-normal text-[var(--ink-soft)]">(선택)</span>
        </label>
        <input
          type="date"
          name="visitedDate"
          className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--coral)]"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-[var(--ink)]">
          설명 <span className="font-normal text-[var(--ink-soft)]">(선택)</span>
        </label>
        <textarea
          name="description"
          maxLength={PLACE_DESCRIPTION_MAX_LENGTH}
          rows={3}
          placeholder="예: 새벽에 바다 보러 갔던 날"
          className="mt-1.5 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--coral)]"
        />
      </div>

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
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
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
