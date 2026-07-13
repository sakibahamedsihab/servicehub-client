const STEPS = [
  {
    num: "01",
    title: "Choose a Service",
    desc: "Browse 20+ categories. Filter by price, rating, or location. Every vendor is background-checked.",
  },
  {
    num: "02",
    title: "Pick a Time Slot",
    desc: "See the vendor's real-time availability. Select a date and time that works for you — no phone calls.",
  },
  {
    num: "03",
    title: "Get It Done",
    desc: "Vendor confirms your booking. Show up (or stay home) and get the job done. Review when complete.",
  },
];

export function HowItWorks() {
  return (
    <section style={{ padding: "5rem 0", background: "var(--white)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Simple Process</span>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--gray-900)", margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
            How ServiceHub Works
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto" }}>
            From discovery to done — in three steps.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0" }}>
          {STEPS.map(({ num, title, desc }, i) => (
            <div
              key={num}
              style={{
                padding:     "2.5rem 2rem",
                borderLeft:  i === 0 ? "1.5px solid var(--border)" : "none",
                borderRight: "1.5px solid var(--border)",
                borderTop:   "1.5px solid var(--border)",
                borderBottom:"1.5px solid var(--border)",
                position:    "relative",
              }}
            >
              {/* Number */}
              <div style={{
                fontSize:   "3.5rem",
                fontWeight: 900,
                color:      "var(--orange)",
                opacity:    0.15,
                lineHeight: 1,
                position:   "absolute",
                top:        "1.5rem",
                right:      "1.5rem",
                letterSpacing: "-0.04em",
              }}>
                {num}
              </div>

              {/* Step indicator */}
              <div style={{
                width:        "36px",
                height:       "36px",
                background:   "var(--orange)",
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                color:        "#fff",
                fontWeight:   800,
                fontSize:     "0.85rem",
                marginBottom: "1.25rem",
              }}>
                {num}
              </div>

              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--gray-900)", margin: "0 0 0.6rem", letterSpacing: "-0.01em" }}>
                {title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
