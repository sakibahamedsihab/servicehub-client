import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { VendorProfile } from "@/lib/vendors";
import type { PaginatedServices } from "@/lib/services";
import { ServiceGrid } from "@/components/services/ServiceGrid";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function fetchVendor(id: string): Promise<VendorProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/vendors/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchVendorServices(vendorId: string): Promise<PaginatedServices> {
  const res = await fetch(`${API_BASE}/api/services?vendorId=${vendorId}&limit=12`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch vendor services");
  return res.json();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await fetchVendor(id);
  if (!vendor) return { title: "Vendor Not Found" };
  return {
    title: `${vendor.businessName} — ServiceHub`,
    description: vendor.bio?.substring(0, 160) || "View vendor profile on ServiceHub",
  };
}

export default async function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await fetchVendor(id);

  if (!vendor) {
    notFound();
  }

  const servicesData = await fetchVendorServices(vendor.userId);

  return (
    <main style={{ paddingTop: "63px", minHeight: "100vh", background: "var(--gray-50)", paddingBottom: "4rem" }}>
      {/* Banner */}
      <div style={{ background: "var(--gray-900)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: "120px", height: "120px", background: "var(--gray-800)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
            🏢
          </div>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
              {vendor.businessName}
              {vendor.isVerified && (
                <span style={{ background: "rgba(217,119,87,0.2)", color: "var(--orange)", padding: "4px 8px", fontSize: "0.8rem", fontWeight: 700, marginLeft: "1rem", verticalAlign: "middle" }}>
                  VERIFIED
                </span>
              )}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: "var(--orange)", fontSize: "1.2rem" }}>★</span>
                <span style={{ color: "#fff", fontWeight: 700 }}>{(vendor.rating || 0).toFixed(1)}</span>
                <span style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>({vendor.reviewCount || 0} reviews)</span>
              </div>
              <span style={{ color: "#525252" }}>•</span>
              <span style={{ color: "#a3a3a3", fontSize: "0.95rem" }}>
                Joined {new Date(vendor.createdAt).getFullYear()}
              </span>
            </div>
            {vendor.bio && (
              <p style={{ color: "#d4d4d4", fontSize: "1rem", lineHeight: 1.6, marginTop: "1rem", maxWidth: "800px" }}>
                {vendor.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "2rem" }}>
          Services by {vendor.businessName}
        </h2>
        
        <Suspense fallback={
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: "360px", background: "var(--white)", border: "1.5px solid var(--border)" }}>
                <div style={{ height: "180px", background: "var(--gray-100)", animation: "pulse 2s infinite" }} />
              </div>
            ))}
          </div>
        }>
          <ServiceGrid data={servicesData} />
        </Suspense>
      </div>
    </main>
  );
}
