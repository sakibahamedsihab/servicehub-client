const STATS = [
  { num: "12,400+", label: "Bookings Completed", icon: "📅" },
  { num: "2,400+",  label: "Services Listed",    icon: "📋" },
  { num: "180+",    label: "Verified Vendors",   icon: "✅" },
  { num: "4.8 / 5", label: "Platform Rating",    icon: "⭐" },
];

export function Stats() {
  return (
    <section style={{ padding: "4rem 0", background: "var(--gray-900)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0" }}>
          {STATS.map(({ num, label, icon }, i) => (
            <div
              key={label}
              style={{
                padding:      "2rem",
                textAlign:    "center",
                borderLeft:   i === 0 ? "1px solid #404040" : "none",
                borderRight:  "1px solid #404040",
                borderTop:    "1px solid #404040",
                borderBottom: "1px solid #404040",
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{icon}</div>
              <div style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "var(--orange)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {num}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#a3a3a3", marginTop: "0.4rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
