import Link from "next/link";

const CATEGORIES = [
  { id: "cleaning",    label: "Home Cleaning",      icon: "🧹", count: 48  },
  { id: "plumbing",    label: "Plumbing",            icon: "🔧", count: 32  },
  { id: "electrical",  label: "Electrical",          icon: "⚡", count: 27  },
  { id: "landscaping", label: "Landscaping",         icon: "🌿", count: 21  },
  { id: "appliance",   label: "Appliance Repair",    icon: "🛠️", count: 19  },
  { id: "moving",      label: "Moving & Storage",    icon: "📦", count: 14  },
  { id: "painting",    label: "Painting",            icon: "🎨", count: 23  },
  { id: "pest",        label: "Pest Control",        icon: "🐛", count: 11  },
];

export function Categories() {
  return (
    <section className="py-10 md:py-20" style={{ background: "var(--gray-50)", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
              <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Categories</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--gray-900)", margin: 0, letterSpacing: "-0.02em" }}>
              What do you need?
            </h2>
          </div>
          <Link href="/services" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--orange)", textDecoration: "none" }}>
            View all services →
          </Link>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}>
          {CATEGORIES.map(({ id, label, icon, count }) => (
            <Link
              key={id}
              href={`/services?category=${id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="hover-orange-border"
                style={{
                  background:  "var(--white)",
                  border:      "1.5px solid var(--border)",
                  padding:     "1.5rem",
                  display:     "flex",
                  flexDirection:"column",
                  gap:         "0.6rem",
                  cursor:      "pointer",
                }}
              >
                <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{icon}</span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--gray-900)" }}>{label}</span>
                <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>{count} services</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
