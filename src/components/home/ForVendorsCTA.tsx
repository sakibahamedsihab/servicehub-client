import Link from "next/link";

export function ForVendorsCTA() {
  return (
    <section style={{ padding: "5rem 0", background: "var(--white)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "1.5px solid var(--border)",
        }}>
          {/* Left — text */}
          <div style={{ padding: "3.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>For Vendors</span>
            </div>

            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, color: "var(--gray-900)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Grow your service business with us
            </h2>
            <p style={{ color: "var(--gray-500)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0, maxWidth: "360px" }}>
              List your services, set your availability, and let customers come to you. No subscription fee to start.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                "Set your own schedule & pricing",
                "Instant booking notifications",
                "Built-in customer reviews",
                "Zero upfront cost to list",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem", color: "var(--gray-700)" }}>
                  <span style={{ width: "18px", height: "18px", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.65rem", flexShrink: 0, fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <Link href="/register" style={{ display: "inline-flex", alignItems: "center", padding: "0.75rem 1.5rem", background: "var(--orange)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
                Start for Free →
              </Link>
              <Link href="/how-it-works" style={{ display: "inline-flex", alignItems: "center", padding: "0.75rem 1.5rem", border: "1.5px solid var(--border)", color: "var(--gray-700)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
                Learn More
              </Link>
            </div>
          </div>

          {/* Right — orange panel */}
          <div style={{
            background:    "var(--orange)",
            padding:       "3.5rem",
            display:       "flex",
            flexDirection: "column",
            justifyContent:"center",
            gap:           "1.5rem",
            borderLeft:    "1.5px solid var(--border)",
          }}>
            {[
              { num: "180+", label: "Active Vendors"   },
              { num: "98%",  label: "Satisfaction Rate" },
              { num: "3 min",label: "Avg. Booking Time" },
            ].map(({ num, label }) => (
              <div key={label} style={{ borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: "1.25rem" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", marginTop: "0.3rem", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
