import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ServiceForm } from "@/components/dashboard/ServiceForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Create Service — ServiceHub",
};

export default async function CreateServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user || (session.user as any).role !== "vendor") {
    redirect("/dashboard");
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
          Create New Service
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--gray-500)", margin: 0 }}>
          List a new service on your profile to start accepting bookings.
        </p>
      </header>

      <ServiceForm />
    </div>
  );
}
