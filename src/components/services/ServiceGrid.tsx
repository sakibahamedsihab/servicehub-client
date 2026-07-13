import Link from "next/link";
import type { PaginatedServices } from "@/lib/services";

export function ServiceGrid({ data }: { data: PaginatedServices }) {
  if (!data.services || data.services.length === 0) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", background: "var(--gray-50)", border: "1.5px solid var(--border)" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          No services found
        </h3>
        <p style={{ color: "var(--gray-500)", margin: 0 }}>
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
        {data.services.map((service) => (
          <Link key={service._id} href={`/services/${service._id}`} style={{ textDecoration: "none" }}>
            <article
              className="hover-orange-border"
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--border)",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image placeholder or real image */}
              <div style={{ height: "180px", background: "linear-gradient(135deg, var(--orange-muted) 0%, var(--gray-100) 100%)", position: "relative" }}>
                {service.images && service.images[0] && (
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                {/* Category Badge */}
                <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(255,255,255,0.9)", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-900)", border: "1px solid var(--border)" }}>
                  {service.categoryId}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--gray-900)", margin: 0, lineHeight: 1.3 }}>
                    {service.title}
                  </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <span style={{ color: "var(--orange)" }}>★</span>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--gray-900)" }}>
                    {service.rating.toFixed(1)}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>
                    ({service.reviewCount} reviews)
                  </span>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--gray-500)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span>⏱</span> {service.durationMinutes} min
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--gray-900)" }}>
                    ${service.price}
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Pagination controls */}
      {data.total > data.limit && (
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
          {Array.from({ length: Math.ceil(data.total / data.limit) }).map((_, i) => (
            <Link
              key={i}
              href={`?page=${i + 1}`}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: data.page === i + 1 ? "var(--orange)" : "var(--white)",
                color: data.page === i + 1 ? "#fff" : "var(--gray-900)",
                border: "1.5px solid",
                borderColor: data.page === i + 1 ? "var(--orange)" : "var(--border)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
