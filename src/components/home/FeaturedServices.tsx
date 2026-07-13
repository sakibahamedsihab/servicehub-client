import Link from "next/link";

// Static placeholder cards — real data wired in Phase 7
const FEATURED = [
  { id: "1", title: "Deep Home Cleaning",    category: "Cleaning",   price: 89,  rating: 4.9, reviews: 128, vendor: "CleanPro Services",   duration: 120 },
  { id: "2", title: "Emergency Plumbing Fix",category: "Plumbing",   price: 120, rating: 4.8, reviews: 94,  vendor: "QuickFix Plumbers",   duration: 60  },
  { id: "3", title: "Full Electrical Audit", category: "Electrical", price: 150, rating: 4.7, reviews: 61,  vendor: "Bright Electric Co.", duration: 90  },
  { id: "4", title: "Garden Maintenance",    category: "Landscaping",price: 65,  rating: 4.9, reviews: 203, vendor: "Green Thumb Co.",     duration: 180 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#F59E0B", fontSize: "0.85rem", fontWeight: 700 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
    </span>
  );
}

export function FeaturedServices() {
  return (
    <section style={{ padding: "5rem 0", background: "var(--gray-50)", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
              <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Top Rated</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--gray-900)", margin: 0, letterSpacing: "-0.02em" }}>
              Featured Services
            </h2>
          </div>
          <Link href="/services" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--orange)", textDecoration: "none" }}>
            See all →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {FEATURED.map(({ id, title, category, price, rating, reviews, vendor, duration }) => (
            <Link key={id} href={`/services/${id}`} style={{ textDecoration: "none" }}>
              <article
                className="hover-orange-border"
                style={{
                  background:   "var(--white)",
                  border:       "1.5px solid var(--border)",
                  overflow:     "hidden",
                  height:       "100%",
                  display:      "flex",
                  flexDirection:"column",
                }}
              >
                {/* Image placeholder */}
                <div style={{ height: "160px", background: "linear-gradient(135deg, var(--orange-muted) 0%, var(--gray-100) 100%)", position: "relative" }}>
                  <span style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem", background: "var(--orange)", color: "#fff", padding: "0.25rem 0.6rem", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>
                    {category.toUpperCase()}
                  </span>
                </div>

                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--gray-900)", letterSpacing: "-0.01em" }}>
                    {title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>{vendor}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: "var(--orange)" }}>★</span>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--gray-900)" }}>
                      {(rating || 0).toFixed(1)}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--gray-500)", marginLeft: "0.2rem" }}>
                      ({reviews || 0})
                    </span>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gray-900)" }}>${price}</span>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginLeft: "0.25rem" }}>/ {duration} min</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--orange)" }}>Book now →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
