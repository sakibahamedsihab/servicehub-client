import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, hint, leftIcon, id, style, ...rest }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
      {label && (
        <label
          htmlFor={id}
          className="form-label"
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {leftIcon && (
          <span style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--gray-400)",
            display: "flex",
            alignItems: "center",
          }}>
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`form-input${error ? " error" : ""}`}
          style={{
            paddingLeft: leftIcon ? "2.25rem" : undefined,
            ...style,
          }}
          {...rest}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>{hint}</p>}
    </div>
  );
}
