"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Briefcase,
  Users,
  ShieldCheck,
  Clock,
  Menu,
  X,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  userRole: "customer" | "vendor" | "admin";
  userName: string;
  userEmail: string;
}

export function DashboardSidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation in mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const getLinks = () => {
    switch (userRole) {
      case "vendor":
        return [
          { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
          { name: "My Services", href: "/dashboard/services", icon: Briefcase },
          { name: "Availability", href: "/dashboard/availability", icon: Clock },
          { name: "Booking Requests", href: "/dashboard/booking-requests", icon: Calendar },
          { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
        ];
      case "admin":
        return [
          { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
          { name: "Vendors", href: "/dashboard/admin/vendors", icon: ShieldCheck },
          { name: "Users", href: "/dashboard/admin/users", icon: Users },
          { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
        ];
      case "customer":
      default:
        return [
          { name: "My Bookings", href: "/dashboard", icon: Calendar },
          { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "64px", background: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", zIndex: 50, borderBottom: "1px solid var(--gray-800)" }}>
          <Link href="/" style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem", textDecoration: "none" }}>
            Service<span style={{ color: "var(--orange)" }}>Hub</span>
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar Overlay (Mobile) */}
      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: 0,
        height: "100vh",
        width: "280px",
        background: "var(--gray-900)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease",
        transform: isMobile ? (isOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
        zIndex: 45,
        borderRight: "1px solid var(--gray-800)"
      }}>
        <div style={{ padding: "2rem 1.5rem", borderBottom: "1px solid var(--gray-800)" }}>
          {!isMobile && (
            <Link href="/" style={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem", textDecoration: "none", display: "block", marginBottom: "2rem" }}>
              Service<span style={{ color: "var(--orange)" }}>Hub</span>
            </Link>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--gray-800)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--gray-700)" }}>
              <UserIcon size={24} color="var(--orange)" />
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontWeight: 600, fontSize: "0.95rem", margin: "0 0 0.2rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{userName}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--gray-400)", margin: 0, textTransform: "capitalize" }}>{userRole} Account</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "1.5rem 1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  background: isActive ? "rgba(217,119,87,0.15)" : "transparent",
                  color: isActive ? "var(--orange)" : "var(--gray-300)",
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "var(--gray-800)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Icon size={20} />
                  {link.name}
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "1.5rem 1rem", borderTop: "1px solid var(--gray-800)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              background: "transparent",
              color: "var(--gray-400)",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "1rem",
              transition: "all 0.2s",
              textAlign: "left"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--gray-800)";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--gray-400)";
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
