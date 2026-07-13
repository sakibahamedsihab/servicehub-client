export const metadata = {
  title: "About ServiceHub — Our Mission & Story",
  description: "Learn about ServiceHub's mission to connect customers with trusted local service providers.",
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: "63px" }}>
      {/* Hero */}
      <section style={{ padding: "4rem 0", background: "var(--gray-50)", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Our Story</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "var(--gray-900)", margin: "0 0 1rem", letterSpacing: "-0.03em" }}>
            Building the future of local services
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--gray-500)", lineHeight: 1.8, margin: 0 }}>
            ServiceHub was founded on a simple belief: booking a local service should be as easy as ordering a meal. No phone tag, no uncertainty, no middlemen.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "4rem 0", background: "var(--white)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            <div>
              <div style={{ width: "40px", height: "40px", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1rem" }}>🎯</div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--gray-900)", margin: "0 0 0.75rem" }}>Our Mission</h2>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-500)", lineHeight: 1.75, margin: 0 }}>
                To make local service discovery and booking effortless for every household — while helping skilled vendors build sustainable businesses.
              </p>
            </div>
            <div>
              <div style={{ width: "40px", height: "40px", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1rem" }}>🤝</div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--gray-900)", margin: "0 0 0.75rem" }}>Our Values</h2>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-500)", lineHeight: 1.75, margin: 0 }}>
                Transparency in pricing. Trust through verification. Excellence through customer feedback. These aren't slogans — they're the architecture of the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ padding: "3rem 0", background: "var(--gray-900)", borderTop: "1.5px solid var(--border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", textAlign: "center" }}>
            {[{ num: "2019", label: "Founded" }, { num: "180+", label: "Vendors" }, { num: "12K+", label: "Bookings" }].map(({ num, label }, i) => (
              <div key={label} style={{ padding: "2rem", borderLeft: i > 0 ? "1px solid #404040" : "none" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--orange)", letterSpacing: "-0.03em" }}>{num}</div>
                <div style={{ fontSize: "0.78rem", color: "#a3a3a3", marginTop: "0.3rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
