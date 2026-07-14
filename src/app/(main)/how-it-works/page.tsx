import { FadeIn } from "@/components/ui/FadeIn";

export const metadata = {
  title: "How ServiceHub Works — Simple Booking in 3 Steps",
  description: "Learn how to find services, pick time slots, and book local vendors on ServiceHub.",
};

const STEPS = [
  {
    num: "01", icon: "🔍",
    title: "Discover Services",
    desc: "Browse by category or search directly. Every listing shows verified reviews, pricing, service duration, and vendor information.",
    tip:  "Tip: Use filters to narrow by price range or minimum rating.",
  },
  {
    num: "02", icon: "📅",
    title: "Pick a Time Slot",
    desc: "View the vendor's real-time availability calendar. Select a date and an open slot — no phone calls, no waiting, no guessing.",
    tip:  "Tip: Slots are claimed instantly. If your preferred time is gone, check nearby times.",
  },
  {
    num: "03", icon: "✅",
    title: "Booking Confirmed",
    desc: "Submit your booking. The vendor reviews and confirms (usually within hours). You'll get a notification with all the details.",
    tip:  "Tip: Add notes to your booking to give the vendor important context before they arrive.",
  },
  {
    num: "04", icon: "⭐",
    title: "Review & Repeat",
    desc: "After the service is marked complete, leave a rating and review. Your feedback helps other customers and improves vendor quality.",
    tip:  "Tip: Honest reviews — positive and constructive — make the platform better for everyone.",
  },
];

export default function HowItWorksPage() {
  return (
    <main style={{ paddingTop: "63px" }}>
      {/* Header */}
      <FadeIn><section style={{ padding: "4rem 0", background: "var(--gray-50)", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Simple Process</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "var(--gray-900)", margin: "0 0 0.75rem", letterSpacing: "-0.03em" }}>
            How ServiceHub Works
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--gray-500)", lineHeight: 1.75, margin: 0 }}>
            From first search to booked appointment — here's everything you need to know.
          </p>
        </div>
      </section></FadeIn>

      {/* Steps */}
      <FadeIn delay={0.1}><section style={{ padding: "4rem 0", background: "var(--white)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "0" }}>
          {STEPS.map(({ num, icon, title, desc, tip }, i) => (
            <div
              key={num}
              style={{
                display:     "grid",
                gridTemplateColumns: "60px 1fr",
                gap:         "1rem",
                padding:     "1.5rem 0",
                borderBottom: i < STEPS.length - 1 ? "1.5px solid var(--border)" : "none",
                alignItems:  "flex-start",
              }} className="md:gap-8 md:grid-cols-[80px_1fr] md:py-10">
              {/* Number + icon */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "52px", height: "52px", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: "1rem" }}>
                  {num}
                </div>
                <span style={{ fontSize: "1.5rem" }}>{icon}</span>
              </div>
              {/* Content */}
              <div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--gray-900)", margin: "0 0 0.6rem", letterSpacing: "-0.01em" }}>{title}</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--gray-500)", lineHeight: 1.75, margin: "0 0 0.75rem" }}>{desc}</p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", background: "var(--orange-muted)", padding: "0.75rem 1rem", border: "1px solid var(--orange-light)" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--orange)" }}>ℹ</span>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--orange-dark)", fontStyle: "italic" }}>{tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section></FadeIn>
    </main>
  );
}
