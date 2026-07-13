import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — ServiceHub",
  description: "Sign in to your ServiceHub account to manage bookings and services.",
};

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--gray-50)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {/* Accent bar top */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--orange)",
        }}
      />
      <LoginForm />
    </main>
  );
}
