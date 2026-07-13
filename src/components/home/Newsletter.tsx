"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]        = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section style={{ padding: "4rem 0", background: "var(--orange)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
          Stay in the loop
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", margin: "0 0 2rem" }}>
          Get notified about new vendors, services, and platform updates.
        </p>

        {submitted ? (
          <div style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", padding: "1rem 1.5rem", color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>
            ✓ You're on the list! We'll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0", maxWidth: "480px", margin: "0 auto" }}>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex:        1,
                padding:     "0.75rem 1rem",
                border:      "1.5px solid rgba(255,255,255,0.5)",
                borderRight: "none",
                background:  "rgba(255,255,255,0.1)",
                color:       "#fff",
                fontSize:    "0.875rem",
                outline:     "none",
                borderRadius: 0,
              }}
            />
            <button
              type="submit"
              style={{
                padding:    "0.75rem 1.25rem",
                background: "#fff",
                color:      "var(--orange)",
                border:     "1.5px solid rgba(255,255,255,0.5)",
                fontWeight: 700,
                fontSize:   "0.875rem",
                cursor:     "pointer",
                whiteSpace: "nowrap",
                borderRadius: 0,
              }}
            >
              Subscribe →
            </button>
          </form>
        )}
        {error && <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</p>}
      </div>
    </section>
  );
}
