import { FAQ } from "@/components/home/FAQ";

export const metadata = {
  title: "FAQ — ServiceHub Help Center",
  description: "Answers to the most common questions about booking, vendors, payments, and cancellations on ServiceHub.",
};

export default function FAQPage() {
  return (
    <main style={{ paddingTop: "63px" }}>
      <section style={{ padding: "4rem 0 2rem", background: "var(--gray-50)", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Help Center</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "var(--gray-900)", margin: "0 0 0.75rem", letterSpacing: "-0.03em" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--gray-500)", lineHeight: 1.75, margin: 0 }}>
            Can't find what you're looking for?{" "}
            <a href="/contact" style={{ color: "var(--orange)", fontWeight: 600 }}>Contact our support team</a>.
          </p>
        </div>
      </section>

      {/* Reuse FAQ component from home page */}
      <FAQ />
    </main>
  );
}
