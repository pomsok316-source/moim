const PALETTE = ["#e2603f", "#5f9e82", "#e0a935", "#7d6bab", "#4a86ad", "#c65f82"];
const SKIN = "#ffd9b3";

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export default function MemberAvatar({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const accent = colorForName(name);
  return (
    <svg viewBox="0 0 40 44" width={size} height={size * (44 / 40)} role="img" aria-label={name}>
      {/* 몸 */}
      <rect x="8" y="26" width="24" height="16" rx="8" fill={accent} />
      {/* 얼굴 */}
      <circle cx="20" cy="18" r="12" fill={SKIN} />
      {/* 머리 */}
      <path d="M6,17 A14,13 0 0 1 34,17 L34,13 A14,13 0 0 0 6,13 Z" fill={accent} />
      <circle cx="6.5" cy="16" r="2.6" fill={accent} />
      <circle cx="33.5" cy="16" r="2.6" fill={accent} />
      {/* 눈 */}
      <circle cx="15.5" cy="19" r="1.6" fill="#4a3728" />
      <circle cx="24.5" cy="19" r="1.6" fill="#4a3728" />
      {/* 볼 */}
      <circle cx="13.5" cy="23" r="2" fill="#ff9d80" opacity="0.5" />
      <circle cx="26.5" cy="23" r="2" fill="#ff9d80" opacity="0.5" />
    </svg>
  );
}
