type Props = {
  size?: number;
  dark?: boolean;
  className?: string;
};

export function FLWordmark({ size = 22, dark = false, className }: Props) {
  const linkColor = dark ? "#FFFFFF" : "#1A365D";
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-montserrat), Helvetica Neue, sans-serif",
        fontSize: size,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "baseline",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontWeight: 900,
          color: "#E53E3E",
          letterSpacing: "-0.02em",
        }}
      >
        FLOW
      </span>
      <span
        style={{
          fontWeight: 400,
          color: linkColor,
          letterSpacing: "0.04em",
        }}
      >
        LINK
      </span>
    </span>
  );
}
