"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { User, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: 1, justifyContent: "center" }} className="nav-desktop-links">
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
            <div ref={profileRef} style={{ position: "relative" }} className="nav-profile">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.75rem",
                  background: "none",
                  border: "1.5px solid var(--border)",
                  cursor: "pointer",
                  color: "var(--gray-700)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--orange-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={16} color="var(--orange)" />
                </div>
                <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session.user.name}
                </span>
                <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>

              {profileOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: "180px", background: "var(--white)", border: "1.5px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 200, display: "flex", flexDirection: "column", padding: "0.35rem" }}>
                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      padding: "0.65rem 0.85rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--gray-700)",
                      textDecoration: "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--gray-50)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setProfileOpen(false); }}
                    style={{
                      padding: "0.65rem 0.85rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--error)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
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
            }}
            className="nav-hamburger"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 90,
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--white)",
                borderTop: "1.5px solid var(--border)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.10)",
                zIndex: 95,
                padding: "1rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    padding: "0.75rem 0",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    fontWeight: isActive(href) ? 700 : 500,
                    color: isActive(href) ? "var(--orange)" : "var(--gray-700)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {label}
                </Link>
              ))}
              {session?.user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "0.75rem",
                      border: "1.5px solid var(--border)",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--gray-700)",
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMenuOpen(false); }}
                    style={{
                      padding: "0.75rem",
                      background: "var(--orange)",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#fff",
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.75rem",
                      border: "1.5px solid var(--border)",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--gray-700)",
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.75rem",
                      background: "var(--orange)",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#fff",
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
          .nav-profile { display: none !important; }
          .nav-desktop-links { display: none !important; }
        }
      `}</style>
    </header>
  );
}
