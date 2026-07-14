import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { href: "/services",     label: "Browse Services"  },
    { href: "/how-it-works", label: "How It Works"     },
    { href: "/about",        label: "About Us"          },
  ],
  "For Vendors": [
    { href: "/register",     label: "Become a Vendor"  },
    { href: "/dashboard",    label: "Vendor Dashboard" },
    { href: "/faq",          label: "FAQ"              },
  ],
  Support: [
    { href: "/contact",      label: "Contact Us"       },
    { href: "/faq",          label: "Help Center"      },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--gray-900)", color: "#d4d4d4", marginTop: "auto" }}>
      {/* Orange top stripe */}
      <div style={{ height: "3px", background: "var(--orange)" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "2.5rem" }}>
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: "8px", height: "22px", background: "var(--orange)", flexShrink: 0 }} />
              <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#fff", letterSpacing: "-0.01em" }}>
                ServiceHub
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#a3a3a3", maxWidth: "240px", margin: 0 }}>
              Connecting customers with trusted local service providers. Book appointments in seconds.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", marginTop: 0 }}>
                {heading}
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover-orange-text"
                      style={{ textDecoration: "none", color: "#a3a3a3", fontSize: "0.875rem" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid #262626", marginTop: "3rem", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#737373", margin: 0 }}>
            © {year} ServiceHub. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Link key={item} href="/contact" style={{ fontSize: "0.8rem", color: "#737373", textDecoration: "none" }}>{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
