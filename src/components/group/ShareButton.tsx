"use client";

import { useEffect, useState } from "react";

export default function ShareButton({
  path,
  shareTitle,
  shareText,
  copyLabel = "링크 복사",
}: {
  path: string;
  shareTitle: string;
  shareText: string;
  copyLabel?: string;
}) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setUrl(`${window.location.origin}${path}`);
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [path]);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드 권한이 없는 환경 — 별도 처리 불필요.
    }
  };

  const handleShare = async () => {
    if (!url) return;
    try {
      await navigator.share({ title: shareTitle, text: shareText, url });
    } catch {
      // 공유 취소 등 — 별도 처리 불필요.
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="flex-1 rounded-full border-2 border-[var(--coral)] py-3 text-sm font-bold text-[var(--coral-dark)] transition active:scale-95"
      >
        {copied ? "복사됐어요 ✓" : copyLabel}
      </button>
      {canShare && (
        <button type="button" onClick={handleShare} className="btn-primary flex-1 py-3 text-sm">
          공유하기 ✨
        </button>
      )}
    </div>
  );
}
