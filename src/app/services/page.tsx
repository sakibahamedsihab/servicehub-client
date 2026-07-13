import { Suspense } from "react";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import type { PaginatedServices } from "@/lib/services";

export const metadata = {
  title: "Explore Services — ServiceHub",
  description: "Find and book the best local service professionals.",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function fetchServices(searchParams: { [key: string]: string | string[] | undefined }): Promise<PaginatedServices> {
  const query = new URLSearchParams();
  
  if (typeof searchParams.category === "string") query.append("category", searchParams.category);
  if (typeof searchParams.minPrice === "string") query.append("minPrice", searchParams.minPrice);
  if (typeof searchParams.maxPrice === "string") query.append("maxPrice", searchParams.maxPrice);
  if (typeof searchParams.sort === "string")     query.append("sort", searchParams.sort);
  if (typeof searchParams.page === "string")     query.append("page", searchParams.page);
  
  const qs = query.toString();
  const url = `${API_BASE}/api/services${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    // Revalidate occasionally, or keep it fresh. For now, use no-store to ensure accurate filtering.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  return res.json();
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ServicesPage({ searchParams }: Props) {
  // Await searchParams as required in Next.js 15+
  const params = await searchParams;
  const data = await fetchServices(params);

  return (
    <main style={{ paddingTop: "63px", minHeight: "100vh", background: "var(--gray-50)" }}>
      {/* Header */}
      <section style={{ padding: "4rem 0", background: "var(--white)", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Explore</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "var(--gray-900)", margin: "0 0 0.75rem", letterSpacing: "-0.03em" }}>
            Available Services
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--gray-500)", lineHeight: 1.75, margin: 0 }}>
            Browse highly-rated professionals for your everyday needs.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <section style={{ padding: "4rem 0" }}>
        <div className="services-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          
          {/* Sidebar */}
          <div>
            <ServiceFilters />
          </div>

          {/* Grid */}
          <div>
            <Suspense fallback={
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ height: "360px", background: "var(--white)", border: "1.5px solid var(--border)" }}>
                    <div style={{ height: "180px", background: "var(--gray-100)", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                    <div style={{ padding: "1.25rem" }}>
                      <div style={{ height: "20px", width: "70%", background: "var(--gray-100)", marginBottom: "1rem" }} />
                      <div style={{ height: "16px", width: "40%", background: "var(--gray-100)" }} />
                    </div>
                  </div>
                ))}
              </div>
            }>
              <ServiceGrid data={data} />
            </Suspense>
          </div>

        </div>
      </section>
    </main>
  );
}
