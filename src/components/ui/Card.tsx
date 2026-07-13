import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddings = {
  none: "0",
  sm:   "1rem",
  md:   "1.5rem",
  lg:   "2rem",
};

export function Card({
  children,
  style,
  hoverable = false,
  padding  = "md",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={hoverable ? "hover-orange-border" : undefined}
      style={{
        background:  "var(--white)",
        border:      "1.5px solid var(--border)",
        borderRadius: 0,
        padding:     paddings[padding],
        cursor:      onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
