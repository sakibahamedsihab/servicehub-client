import Link from "next/link";
import type { PaginatedServices } from "@/lib/services";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function fetchRelatedServices(category: string, currentId: string): Promise<PaginatedServices> {
  const url = `${API_BASE}/api/services?category=${encodeURIComponent(category)}&limit=4`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch related services");
  
  const data: PaginatedServices = await res.json();
  // Filter out current and slice to 3
  return {
    ...data,
    services: data.services.filter((s) => s._id !== currentId).slice(0, 3)
  };
}

export async function RelatedServices({ category, currentId }: { category: string, currentId: string }) {
  try {
    const data = await fetchRelatedServices(category, currentId);

    if (data.services.length === 0) return null;

    return (
      <section style={{ marginTop: "4rem", paddingTop: "4rem", borderTop: "1.5px solid var(--border)" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "2rem", letterSpacing: "-0.02em" }}>
          Similar Services
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {data.services.map((service) => (
            <Link key={service._id} href={`/services/${service._id}`} style={{ textDecoration: "none" }}>
              <article
                className="hover-orange-border"
                style={{
                  background: "var(--white)",
                  border: "1.5px solid var(--border)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: "160px", background: "linear-gradient(135deg, var(--orange-muted) 0%, var(--gray-100) 100%)" }}>
                  {service.images?.[0] && (
                    <img src={service.images[0]} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gray-900)", margin: "0 0 0.5rem" }}>
                    {service.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ color: "var(--orange)", fontSize: "0.9rem" }}>★</span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--gray-900)" }}>{service.rating.toFixed(1)}</span>
                  </div>
                  <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--gray-500)" }}>{service.durationMinutes} min</span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>${service.price}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    return null; // Graceful degradation
  }
}
