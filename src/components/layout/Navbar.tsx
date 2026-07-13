"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

const NAV_LINKS = [
  { href: "/services",    label: "Services"    },
  { href: "/how-it-works",label: "How It Works"},
  { href: "/about",       label: "About"       },
];

export function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      style={{
        position:    "fixed",
        top:         0,
        left:        0,
        right:       0,
        zIndex:      100,
        background:  "var(--white)",
        borderBottom: scrolled ? "1.5px solid var(--border)" : "1.5px solid transparent",
        transition:  "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow:   scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Orange top accent bar */}
      <div style={{ height: "3px", background: "var(--orange)", width: "100%" }} />

      <nav
        style={{
          maxWidth:  "1200px",
          margin:    "0 auto",
          padding:   "0 1.5rem",
          height:    "60px",
          display:   "flex",
          alignItems:"center",
          justifyContent: "space-between",
          gap:       "2rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
        >
          <div style={{ width: "8px", height: "22px", background: "var(--orange)", flexShrink: 0 }} />
          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--gray-900)", letterSpacing: "-0.01em" }}>
            ServiceHub
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, justifyContent: "center" }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding:        "0.4rem 0.85rem",
                textDecoration: "none",
                fontSize:       "0.875rem",
                fontWeight:     isActive(href) ? 700 : 500,
                color:          isActive(href) ? "var(--orange)" : "var(--gray-700)",
                borderBottom:   isActive(href) ? "2px solid var(--orange)" : "2px solid transparent",
                transition:     "color 0.15s ease, border-color 0.15s ease",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--gray-700)",
                  textDecoration: "none",
                  border: "1.5px solid var(--border)",
                  transition: "all 0.15s ease",
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  padding:    "0.45rem 1rem",
                  fontSize:   "0.85rem",
                  fontWeight: 600,
                  background: "var(--orange)",
                  color:      "#fff",
                  border:     "none",
                  cursor:     "pointer",
                  transition: "background 0.15s ease",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--gray-700)",
                  textDecoration: "none",
                  border: "1.5px solid var(--border)",
                  transition: "all 0.15s ease",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                style={{
                  padding:    "0.45rem 1rem",
                  fontSize:   "0.85rem",
                  fontWeight: 600,
                  background: "var(--orange)",
                  color:      "#fff",
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                }}
              >
                Get Started
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              display:    "none",
              background: "none",
              border:     "none",
              cursor:     "pointer",
              padding:    "0.25rem",
              color:      "var(--gray-700)",
              fontSize:   "1.25rem",
            }}
            className="nav-hamburger"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop:  "1.5px solid var(--border)",
          background: "var(--white)",
          padding:    "1rem 1.5rem",
          display:    "flex",
          flexDirection: "column",
          gap:        "0.5rem",
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding:        "0.6rem 0",
                textDecoration: "none",
                fontSize:       "0.9rem",
                fontWeight:     isActive(href) ? 700 : 500,
                color:          isActive(href) ? "var(--orange)" : "var(--gray-700)",
                borderBottom:   "1px solid var(--border)",
              }}
            >
              {label}
            </Link>
          ))}
          {!session?.user && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <Link href="/login"    onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: "center", padding: "0.6rem", border: "1.5px solid var(--border)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem", color: "var(--gray-700)" }}>Sign In</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: "center", padding: "0.6rem", background: "var(--orange)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem", color: "#fff" }}>Get Started</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
