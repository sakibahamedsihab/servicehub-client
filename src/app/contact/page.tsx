export const metadata = {
  title: "Contact ServiceHub — Get in Touch",
  description: "Reach out to the ServiceHub team for support, vendor inquiries, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "63px" }}>
      <section style={{ padding: "4rem 0", background: "var(--gray-50)", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "var(--gray-900)", margin: "0 0 0.75rem", letterSpacing: "-0.03em" }}>
            Get in touch
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--gray-500)", lineHeight: 1.75, margin: 0 }}>
            Questions? Issues? Partnership ideas? We read every message and respond within 24 hours.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 0", background: "var(--white)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {[
                { icon: "📧", title: "Email",   value: "hello@servicehub.io",  note: "General inquiries" },
                { icon: "🛠️", title: "Support", value: "support@servicehub.io", note: "Booking issues" },
                { icon: "🤝", title: "Vendors",  value: "vendors@servicehub.io", note: "Partner with us" },
              ].map(({ icon, title, value, note }) => (
                <div key={title} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--orange-muted)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--gray-900)" }}>{title}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--orange)", marginTop: "0.15rem" }}>{value}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.1rem" }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact note */}
            <div style={{ background: "var(--gray-50)", border: "1.5px solid var(--border)", padding: "2rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gray-900)", margin: "0 0 0.75rem" }}>Response Times</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { label: "General inquiries", time: "Within 24h" },
                  { label: "Support tickets",   time: "Within 4h"  },
                  { label: "Vendor approvals",  time: "1–2 business days" },
                ].map(({ label, time }) => (
                  <li key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--gray-700)", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                    <span>{label}</span>
                    <span style={{ fontWeight: 700, color: "var(--orange)" }}>{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
