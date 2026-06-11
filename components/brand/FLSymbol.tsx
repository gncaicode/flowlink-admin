type Props = {
  size?: number;
  dark?: boolean;
  className?: string;
};

export function FLSymbol({ size = 40, dark = false, className }: Props) {
  const lineColor = dark ? "rgba(255,255,255,0.78)" : "#1A365D";
  const dotMain = dark ? "rgba(255,255,255,0.45)" : "rgba(26,54,93,0.4)";
  const dotSat = dark ? "rgba(255,255,255,0.28)" : "rgba(26,54,93,0.25)";
  const connector = dark ? "rgba(255,255,255,0.2)" : "rgba(26,54,93,0.18)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle
        cx="40"
        cy="40"
        r="34"
        stroke="#E53E3E"
        strokeWidth="4.5"
        fill="none"
        opacity="0.18"
      />
      <path
        d="M18 40 C18 28, 32 24, 40 32 C48 40, 52 44, 62 40 C52 36, 48 40, 40 48 C32 56, 18 52, 18 40Z"
        fill="none"
        stroke="#E53E3E"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 40 C22 32, 34 36, 40 40 C46 44, 58 48, 66 40"
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <line x1="29" y1="29" x2="40" y2="40" stroke={connector} strokeWidth="0.8" />
      <line x1="51" y1="51" x2="40" y2="40" stroke={connector} strokeWidth="0.8" />
      <line x1="51" y1="29" x2="40" y2="40" stroke={connector} strokeWidth="0.8" />
      <line x1="29" y1="51" x2="40" y2="40" stroke={connector} strokeWidth="0.8" />
      <circle cx="40" cy="40" r="4" fill="#319795" />
      <circle cx="18" cy="40" r="2.5" fill="#E53E3E" />
      <circle cx="62" cy="40" r="2.5" fill="#E53E3E" />
      <circle cx="29" cy="29" r="2" fill={dotMain} />
      <circle cx="51" cy="51" r="2" fill={dotMain} />
      <circle cx="51" cy="29" r="2" fill={dotSat} />
      <circle cx="29" cy="51" r="2" fill={dotSat} />
    </svg>
  );
}
