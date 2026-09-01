"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deletePlaceAction, type DeletePlaceState } from "@/app/actions/places";
import PlaceComposer from "./PlaceComposer";
import EmptyState from "./EmptyState";

export type PlaceView = {
  id: string;
  authorId: string;
  authorName: string;
  placeName: string;
  visitedDateLabel: string | null;
  description: string;
  photoDataUrl: string | null;
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

function DeleteButton({ slug, placeId }: { slug: string; placeId: string }) {
  const initial: DeletePlaceState = { status: "idle" };
  const [state, formAction] = useActionState(deletePlaceAction, initial);
  return (
    <form action={formAction}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="placeId" value={placeId} />
      <DeleteSubmitButton />
      {state.status === "error" && (
        <p className="mt-1 text-xs font-medium text-red-500">{state.error}</p>
      )}
    </form>
  );
}

export default function PlacesHub({
  slug,
  places,
  currentMemberId,
}: {
  slug: string;
  places: PlaceView[];
  currentMemberId: string;
}) {
  const [writing, setWriting] = useState(places.length === 0);

  return (
    <div className="flex flex-col gap-4">
      {writing ? (
        <div>
          <PlaceComposer slug={slug} />
          {places.length > 0 && (
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
        <button type="button" onClick={() => setWriting(true)} className="btn-primary w-full py-3.5">
          + 장소 남기기
        </button>
      )}

      {places.length === 0 ? (
        <EmptyState emoji="🌏" title="아직 남긴 장소가 없어요" subtitle="함께 갔던 곳을 남겨보세요." />
      ) : (
        <div className="flex flex-col gap-3">
          {places.map((p) => (
            <div key={p.id} className="card animate-fade-in-up overflow-hidden border border-black/5">
              {p.photoDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photoDataUrl} alt={p.placeName} className="h-40 w-full object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[var(--ink)]">📍 {p.placeName}</p>
                  {p.visitedDateLabel && (
                    <p className="text-xs text-[var(--ink-soft)]">{p.visitedDateLabel}</p>
                  )}
                </div>
                {p.description && (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--ink)]">
                    {p.description}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-[var(--ink-soft)]">{p.authorName}님이 남김</p>
                  {p.authorId === currentMemberId && <DeleteButton slug={slug} placeId={p.id} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
