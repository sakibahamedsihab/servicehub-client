import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ServiceForm } from "@/components/dashboard/ServiceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Service } from "@/lib/services";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function fetchService(id: string): Promise<Service | null> {
  const res = await fetch(`${API_BASE}/api/services/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export const metadata = {
  title: "Edit Service — ServiceHub",
};

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user || (session.user as any).role !== "vendor") {
    redirect("/dashboard");
  }

  const service = await fetchService(id);

  if (!service || service.vendorId !== session.user.id) {
    redirect("/dashboard/services");
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <Link 
          href="/dashboard/services" 
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--gray-500)", textDecoration: "none", fontSize: "0.95rem", fontWeight: 600, marginBottom: "1rem", transition: "color 0.2s" }}
        >
          <ArrowLeft size={16} /> Back to Services
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          Edit Service
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--gray-500)", margin: 0 }}>
          Update the details of this service.
        </p>
      </header>

      <ServiceForm initialData={service} />
    </div>
  );
}
