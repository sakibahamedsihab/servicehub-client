"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { DemoLogin } from "./DemoLogin";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.password || form.password.length < 1)
    errors.password = "Password is required.";
  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      const { error } = await signIn.email({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setErrors({ general: "Invalid email or password. Please try again." });
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
          Welcome back
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
          Sign in to your ServiceHub account.
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
      <div style={{ marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label htmlFor="password" className="form-label" style={{ margin: 0 }}>Password</label>
          <Link
            href="/forgot-password"
            style={{ fontSize: "0.8rem", color: "var(--orange)", textDecoration: "none", fontWeight: 500 }}
          >
            Forgot password?
          </Link>
        </div>
        <div style={{ marginTop: "0.35rem" }}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={form.password}
            onChange={handleChange}
            className={`form-input${errors.password ? " error" : ""}`}
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>
      </div>

      {/* Submit */}
      <div style={{ marginTop: "1.5rem" }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>

      {/* Divider */}
      <div className="auth-divider">or</div>

      {/* Register link */}
      <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted)", margin: 0 }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          style={{ color: "var(--orange)", fontWeight: 600, textDecoration: "none" }}
        >
          Create one
        </Link>
      </p>

      <DemoLogin onComplete={() => router.push("/dashboard")} />
    </form>
  );
}
