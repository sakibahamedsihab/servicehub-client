import React from "react";

type BadgeVariant = "orange" | "green" | "red" | "gray" | "blue";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  orange: { background: "var(--orange-muted)", color: "var(--orange-dark)", border: "1px solid var(--orange-light)" },
  green:  { background: "#F0FDF4",             color: "#15803D",            border: "1px solid #BBF7D0"             },
  red:    { background: "#FEF2F2",             color: "#DC2626",            border: "1px solid #FECACA"             },
  gray:   { background: "var(--gray-100)",     color: "var(--gray-700)",    border: "1px solid var(--gray-200)"     },
  blue:   { background: "#EFF6FF",             color: "#1D4ED8",            border: "1px solid #BFDBFE"             },
};

export function Badge({ variant = "gray", size = "sm", children }: BadgeProps) {
  const fontSize = size === "sm" ? "0.72rem" : "0.8rem";
  const padding  = size === "sm" ? "0.2rem 0.5rem" : "0.3rem 0.7rem";

  return (
    <span
      style={{
        display:    "inline-flex",
        alignItems: "center",
        borderRadius: 0,
        fontWeight: 600,
        fontSize,
        padding,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
