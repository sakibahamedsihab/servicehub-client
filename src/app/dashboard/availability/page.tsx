import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AvailabilityForm } from "@/components/dashboard/AvailabilityForm";
import type { Availability } from "@/lib/availability";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function fetchAvailability(vendorId: string): Promise<Availability | null> {
  const res = await fetch(`${API_BASE}/api/vendors/${vendorId}/availability`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export const metadata = {
  title: "My Availability — ServiceHub",
};

export default async function AvailabilityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user || (session.user as any).role !== "vendor") {
    redirect("/dashboard");
  }

  const availability = await fetchAvailability(session.user.id);

  return (
    <div style={{ maxWidth: "1000px" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          Availability Settings
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--gray-500)", margin: 0 }}>
          Define your regular working hours so customers know when they can book you.
        </p>
      </header>

      <AvailabilityForm vendorId={session.user.id} initialData={availability} />
    </div>
  );
}
