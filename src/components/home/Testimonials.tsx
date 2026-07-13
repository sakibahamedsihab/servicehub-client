const TESTIMONIALS = [
  {
    quote: "Booked a plumber at 9pm, confirmed by midnight, fixed by 8am next morning. ServiceHub is the only platform where this just works.",
    name:  "Alicia Mendez",
    role:  "Homeowner, San Diego",
    rating: 5,
  },
  {
    quote: "As a vendor, I went from chasing phone calls to having a full calendar. My revenue doubled in the first three months after listing.",
    name:  "Marcus Johnson",
    role:  "Licensed Electrician",
    rating: 5,
  },
  {
    quote: "The slot picker is so clean. I could see every available time, picked one, paid a deposit — no back-and-forth needed. Love it.",
    name:  "Priya Sharma",
    role:  "Customer, Austin",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section style={{ padding: "5rem 0", background: "var(--gray-50)", borderTop: "1.5px solid var(--border)", borderBottom: "1.5px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Testimonials</span>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--gray-900)", margin: 0, letterSpacing: "-0.02em" }}>
            What people are saying
          </h2>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {TESTIMONIALS.map(({ quote, name, role, rating }) => (
            <blockquote
              key={name}
              style={{
                background:  "var(--white)",
                border:      "1.5px solid var(--border)",
                padding:     "2rem",
                margin:      0,
                display:     "flex",
                flexDirection:"column",
                gap:         "1.25rem",
              }}
            >
              {/* Orange quote mark */}
              <div style={{ fontSize: "3rem", lineHeight: 1, color: "var(--orange)", fontFamily: "Georgia, serif", opacity: 0.6 }}>"</div>

              {/* Stars */}
              <div style={{ color: "#F59E0B", fontSize: "0.9rem" }}>
                {"★".repeat(rating)}
              </div>

              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--gray-700)", lineHeight: 1.75, fontStyle: "italic" }}>
                {quote}
              </p>

              <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--gray-900)" }}>{name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.2rem" }}>{role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
