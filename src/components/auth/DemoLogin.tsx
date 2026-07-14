"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@servicehub.com", color: "#3B82F6" },
  { label: "Vendor", email: "vendor1@servicehub.com", color: "#10B981" },
  { label: "Customer", email: "customer@servicehub.com", color: "#F59E0B" },
];

export function DemoLogin({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDemoLogin = async (email: string) => {
    setLoading(email);
    try {
      await authClient.signIn.email({
        email,
        password: "Password123!",
      });
      onComplete();
    } catch (err: any) {
      toast.error("Failed to sign in demo account: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px dashed var(--border)", textAlign: "center" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginBottom: "1rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Or test with a Demo Account
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        {DEMO_ACCOUNTS.map((acc) => (
          <Button 
            key={acc.email}
            type="button" 
            variant="secondary" 
            onClick={() => handleDemoLogin(acc.email)}
            disabled={loading !== null}
            style={{ fontSize: "0.85rem", padding: "0.5rem 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: acc.color }} />
            {loading === acc.email ? "..." : acc.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
