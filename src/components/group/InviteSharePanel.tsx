"use client";

import { useEffect, useState } from "react";

export default function InviteSharePanel({
  slug,
  groupName,
}: {
  slug: string;
  groupName: string;
}) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // 브라우저 전용 값(origin, Web Share API 지원 여부)이라 서버 렌더 시점에는 알 수 없다.
    /* eslint-disable react-hooks/set-state-in-effect */
    setUrl(`${window.location.origin}/g/${slug}`);
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [slug]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드 권한이 없는 환경 — 사용자가 직접 선택해 복사할 수 있도록 링크는 항상 화면에 보여준다.
    }
  };

  const handleShare = async () => {
    if (!url) return;
    try {
      await navigator.share({
        title: `${groupName} 모임에 초대해요`,
        text: `${groupName} 모임에 참여해보세요 💌`,
        url,
      });
    } catch {
      // 사용자가 공유를 취소한 경우 등 — 별도 처리 불필요.
    }
  };

  return (
    <div className="card animate-pop-in border border-[var(--coral)]/30 bg-gradient-to-br from-[var(--butter)]/25 to-white p-5">
      <p className="font-heading text-lg text-[var(--coral-dark)]">
        친구들을 초대해보세요 💌
      </p>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        아래 링크를 보내면 바로 참여할 수 있어요.
      </p>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5">
        <span className="flex-1 truncate text-sm text-[var(--ink-soft)]">
          {url || "링크를 불러오는 중..."}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-full border-2 border-[var(--coral)] py-2.5 text-sm font-bold text-[var(--coral-dark)] transition active:scale-95"
        >
          {copied ? "복사됐어요 ✓" : "링크 복사"}
        </button>
        {canShare && (
          <button
            type="button"
            onClick={handleShare}
            className="btn-primary flex-1 py-2.5 text-sm"
          >
            공유하기
          </button>
        )}
      </div>
    </div>
  );
}
