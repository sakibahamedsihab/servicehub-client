"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

type Role = "customer" | "vendor";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters.";
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.password || form.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const { error } = await signUp.email({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        accountType: form.role,
      } as any);
      if (error) {
        setErrors({ general: error.message ?? "Registration failed. Please try again." });
        return;
      }
      router.push("/dashboard");
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-card" noValidate>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "8px", height: "24px", background: "var(--orange)" }} />
          <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.01em", color: "var(--gray-900)" }}>
            ServiceHub
          </span>
        </div>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--gray-900)", margin: 0, letterSpacing: "-0.02em" }}>
          Create an account
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
          Join ServiceHub to book or offer services.
        </p>
      </div>

      {/* Global error */}
      {errors.general && (
        <div style={{
          padding: "0.75rem 1rem",
          background: "#FEF2F2",
          border: "1.5px solid #FECACA",
          color: "#DC2626",
          fontSize: "0.85rem",
          marginBottom: "1.25rem",
          fontWeight: 500,
        }}>
          {errors.general}
        </div>
      )}

      {/* Role selector */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label className="form-label">I am a</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          {(["customer", "vendor"] as Role[]).map((r) => (
            <label
              key={r}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.65rem 0.85rem",
                border: `1.5px solid ${form.role === r ? "var(--orange)" : "var(--border)"}`,
                background: form.role === r ? "var(--orange-muted)" : "var(--white)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={form.role === r}
                onChange={handleChange}
                style={{ accentColor: "var(--orange)" }}
              />
              <span style={{ fontSize: "0.875rem", fontWeight: 500, textTransform: "capitalize", color: "var(--gray-700)" }}>
                {r}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="name" className="form-label">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          className={`form-input${errors.name ? " error" : ""}`}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      {/* Email */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className={`form-input${errors.email ? " error" : ""}`}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      {/* Password */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange}
          className={`form-input${errors.password ? " error" : ""}`}
        />
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={`form-input${errors.confirmPassword ? " error" : ""}`}
        />
        {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </button>

      {/* Divider */}
      <div className="auth-divider">or</div>

      {/* Sign in link */}
      <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted)", margin: 0 }}>
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "var(--orange)", fontWeight: 600, textDecoration: "none" }}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
