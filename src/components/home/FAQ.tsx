"use client";

import { useState } from "react";

const FAQS = [
  { q: "How do I book a service?", a: "Browse services, select one, pick an available time slot, and submit your booking. The vendor will confirm within a few hours." },
  { q: "Are vendors background-checked?", a: "Yes. Every vendor goes through our identity and background verification before their profile goes live." },
  { q: "What if I need to cancel?", a: "You can cancel a pending or confirmed booking from your dashboard. Cancellation policies vary by vendor — check the service page for details." },
  { q: "How do I become a vendor?", a: "Register an account, select the Vendor role, complete your profile, and start listing services. Approval takes 1–2 business days." },
  { q: "Is there a subscription fee?", a: "No subscription. We take a small commission per completed booking. Listing services is always free." },
  { q: "Can I leave a review?", a: "Yes — after a booking is marked completed, you'll be able to leave a rating and review from your bookings dashboard." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ padding: "5rem 0", background: "var(--white)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: "0.1em" }}>FAQ</span>
            <div style={{ width: "24px", height: "3px", background: "var(--orange)" }} />
          </div>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--gray-900)", margin: 0, letterSpacing: "-0.02em" }}>
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div style={{ border: "1.5px solid var(--border)" }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? "1.5px solid var(--border)" : "none" }}>
              <button
                id={`faq-btn-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width:      "100%",
                  padding:    "1.25rem 1.5rem",
                  background: open === i ? "var(--orange-muted)" : "var(--white)",
                  border:     "none",
                  cursor:     "pointer",
                  display:    "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap:        "1rem",
                  textAlign:  "left",
                  transition: "background 0.15s ease",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: open === i ? "var(--orange-dark)" : "var(--gray-900)", lineHeight: 1.4 }}>
                  {q}
                </span>
                <span style={{ color: "var(--orange)", fontSize: "1rem", fontWeight: 700, flexShrink: 0, transition: "transform 0.2s ease", transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                  +
                </span>
              </button>
              {open === i && (
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  style={{ padding: "0 1.5rem 1.25rem", fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.75, borderTop: "1px solid var(--border)" }}
                >
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
