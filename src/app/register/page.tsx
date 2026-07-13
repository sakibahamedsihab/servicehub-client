import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — ServiceHub",
  description: "Join ServiceHub to book services or list your offerings as a vendor.",
};

export default function RegisterPage() {
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
      <RegisterForm />
    </main>
  );
}
