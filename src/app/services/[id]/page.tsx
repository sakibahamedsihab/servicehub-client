import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RelatedServices } from "@/components/services/RelatedServices";
import type { Service } from "@/lib/services";
import type { VendorProfile } from "@/lib/vendors";
import { Button } from "@/components/ui/Button";

import { SlotPicker } from "@/components/services/SlotPicker";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function fetchServiceAndVendor(id: string): Promise<{ service: Service; vendor: VendorProfile } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/services/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const service: Service = await res.json();

    const vendorRes = await fetch(`${API_BASE}/api/vendors/${service.vendorId}`, { cache: "no-store" });
    const vendor: VendorProfile = vendorRes.ok ? await vendorRes.json() : null;

    return { service, vendor };
  } catch (error) {
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = await fetchServiceAndVendor(id);
  if (!data) return { title: "Not Found — ServiceHub" };
  return {
    title: `${data.service.title} — ServiceHub`,
    description: data.service.description.substring(0, 160),
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;
  const data = await fetchServiceAndVendor(id);

  if (!data) {
    notFound();
  }

  const { service, vendor } = data;

  return (
    <main style={{ paddingTop: "63px", minHeight: "100vh", background: "var(--gray-50)", paddingBottom: "4rem" }}>
      {/* Header Banner */}
      <div style={{ background: "var(--gray-900)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "var(--orange)", color: "#fff", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
            {service.categoryId}
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 1rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {service.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ color: "var(--orange)", fontSize: "1.2rem" }}>★</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>{(service.rating || 0).toFixed(1)}</span>
              <span style={{ color: "#a3a3a3", fontSize: "0.9rem" }}>({service.reviewCount || 0} reviews)</span>
            </div>
            {vendor && (
              <>
                <span style={{ color: "#525252" }}>•</span>
                <span style={{ color: "#fff", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>🏢</span> {vendor.businessName}
                  {vendor.isVerified && (
                    <span style={{ background: "rgba(217,119,87,0.2)", color: "var(--orange)", padding: "2px 6px", fontSize: "0.7rem", fontWeight: 700, borderRadius: 0 }}>VERIFIED</span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div className="service-details-layout">
          
          {/* Main Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            
            {/* Image Gallery Placeholder */}
            <div style={{ border: "1.5px solid var(--border)", background: "var(--white)", padding: "0.5rem" }}>
              <div style={{ height: "400px", background: "linear-gradient(135deg, var(--orange-muted) 0%, var(--gray-100) 100%)", position: "relative" }}>
                {service.images?.[0] ? (
                  <img src={service.images[0]} alt="Primary" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--gray-500)" }}>No images provided</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "1rem" }}>About This Service</h2>
              <div style={{ fontSize: "1rem", color: "var(--gray-700)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                {service.description}
              </div>
            </div>

            {/* Vendor Profile Snippet */}
            {vendor && (
              <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "1.5rem" }}>About The Vendor</h2>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <div style={{ width: "64px", height: "64px", background: "var(--gray-100)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                    🏢
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.25rem" }}>{vendor.businessName}</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--gray-500)", margin: "0 0 1rem" }}>Member since {new Date(vendor.createdAt).getFullYear()}</p>
                    <p style={{ fontSize: "0.95rem", color: "var(--gray-700)", lineHeight: 1.6, margin: 0 }}>
                      {vendor.bio || "No bio provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Column (Booking Card) */}
          <div style={{ position: "sticky", top: "100px" }}>
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Price</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", lineHeight: 1 }}>${service.price}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Duration</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-700)", lineHeight: 1 }}>{service.durationMinutes} min</div>
                </div>
              </div>

              {/* Slot Picker Component (Task 7.4) */}
              <SlotPicker serviceId={service._id} />
            </div>
          </div>
        </div>

        {/* Related Services */}
        <Suspense fallback={<div style={{ marginTop: "4rem", height: "300px", background: "var(--gray-100)", animation: "pulse 2s infinite" }} />}>
          <RelatedServices category={service.categoryId} currentId={service._id} />
        </Suspense>
      </div>
    </main>
  );
}
