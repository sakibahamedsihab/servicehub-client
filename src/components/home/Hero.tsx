import Link from "next/link";

export function Hero() {
  return (
    <section
      style={{
        background:    "var(--white)",
        position:      "relative",
        overflow:      "hidden",
      }}
      className="pt-[calc(63px+2.5rem)] pb-10 md:pt-[calc(63px+5rem)] md:pb-20"
    >
      {/* Background geometric accent */}
      <div className="hidden md:block" style={{
        position:   "absolute",
        top:        0,
        right:      0,
        width:      "45%",
        height:     "100%",
        background: "var(--orange-muted)",
        clipPath:   "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
        zIndex:     0,
      }} />
      <div className="hidden md:block" style={{
        position:   "absolute",
        top:        "2rem",
        right:      "3rem",
        width:      "6px",
        height:     "60%",
        background: "var(--orange)",
        opacity:    0.4,
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "620px" }}>
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ width: "32px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Book. Confirm. Done.
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize:      "clamp(2.25rem, 5vw, 3.5rem)",
            fontWeight:    800,
            lineHeight:    1.1,
            color:         "var(--gray-900)",
            letterSpacing: "-0.03em",
            margin:        "0 0 1.5rem",
          }}>
            Local Services,<br />
            <span style={{ color: "var(--orange)" }}>Booked Instantly</span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "var(--gray-500)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "480px" }}>
            Find trusted home cleaning, plumbing, electrical, and 20+ service categories. Vendors set their schedules — you pick a time.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/services"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "0.5rem",
                padding:        "0.8rem 1.75rem",
                background:     "var(--orange)",
                color:          "#fff",
                fontWeight:     700,
                fontSize:       "0.95rem",
                textDecoration: "none",
                letterSpacing:  "0.01em",
                transition:     "background 0.15s ease",
              }}
            >
              Browse Services →
            </Link>
            <Link
              href="/register"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "0.5rem",
                padding:        "0.8rem 1.75rem",
                border:         "1.5px solid var(--border)",
                color:          "var(--gray-700)",
                fontWeight:     600,
                fontSize:       "0.95rem",
                textDecoration: "none",
                transition:     "border-color 0.15s ease, color 0.15s ease",
              }}
            >
              Become a Vendor
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {[
              { num: "2,400+", label: "Services Listed" },
              { num: "180+",   label: "Verified Vendors" },
              { num: "4.8★",  label: "Average Rating"   },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--gray-900)", letterSpacing: "-0.02em" }}>{num}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
