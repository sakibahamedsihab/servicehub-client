import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const styles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--orange)",
    color: "#fff",
    border: "1.5px solid var(--orange)",
  },
  secondary: {
    background: "transparent",
    color: "var(--gray-700)",
    border: "1.5px solid var(--border)",
  },
  ghost: {
    background: "transparent",
    color: "var(--orange)",
    border: "1.5px solid transparent",
  },
  danger: {
    background: "#EF4444",
    color: "#fff",
    border: "1.5px solid #EF4444",
  },
};

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: "0.4rem 0.9rem",  fontSize: "0.8rem"  },
  md: { padding: "0.6rem 1.25rem", fontSize: "0.875rem" },
  lg: { padding: "0.75rem 1.75rem",fontSize: "1rem"    },
};

export function Button({
  variant  = "primary",
  size     = "md",
  loading  = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        fontFamily: "inherit",
        fontWeight: 600,
        borderRadius: 0,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "all 0.15s ease",
        width: fullWidth ? "100%" : undefined,
        letterSpacing: "0.01em",
        ...styles[variant],
        ...sizes[size],
        ...style,
      }}
      {...rest}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
