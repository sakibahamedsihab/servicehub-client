import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function DashboardOverview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  if (!user) return null;

  return (
    <div style={{ maxWidth: "1000px" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          Welcome back, {user.name.split(" ")[0]}! 👋
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--gray-500)" }}>
          Here's an overview of your {user.role} account.
        </p>
      </header>

      {user.role === "vendor" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <DashboardCard 
            title="Manage Services" 
            desc="Add, edit, or remove your offered services." 
            link="/dashboard/services" 
            color="#ec4899" 
            icon="🛍️" 
          />
          <DashboardCard 
            title="Booking Requests" 
            desc="Review and accept incoming appointments." 
            link="/dashboard/booking-requests" 
            color="#8b5cf6" 
            icon="📅" 
          />
          <DashboardCard 
            title="Availability" 
            desc="Set your working hours and exceptions." 
            link="/dashboard/availability" 
            color="#10b981" 
            icon="⏱️" 
          />
        </div>
      )}

      {(user.role === "customer" || user.role === "user") && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <DashboardCard 
            title="My Bookings" 
            desc="View your upcoming and past appointments." 
            link="/dashboard/bookings" 
            color="#3b82f6" 
            icon="🎟️" 
          />
          <DashboardCard 
            title="Explore Services" 
            desc="Find new professionals to book." 
            link="/services" 
            color="#f59e0b" 
            icon="🔍" 
          />
        </div>
      )}

      {user.role === "admin" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <DashboardCard 
            title="Verify Vendors" 
            desc="Review and approve new vendor accounts." 
            link="/dashboard/admin/vendors" 
            color="#ef4444" 
            icon="🛡️" 
          />
          <DashboardCard 
            title="Manage Users" 
            desc="View all registered users on the platform." 
            link="/dashboard/admin/users" 
            color="#0ea5e9" 
            icon="👥" 
          />
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, desc, link, color, icon }: { title: string, desc: string, link: string, color: string, icon: string }) {
  return (
    <Link href={link} style={{ textDecoration: "none" }}>
      <div style={{
        background: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.5rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: color }} />
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{icon}</div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.5rem" }}>{title}</h3>
        <p style={{ color: "var(--gray-500)", fontSize: "0.95rem", lineHeight: 1.5, flex: 1, margin: "0 0 1.5rem" }}>{desc}</p>
        <div style={{ display: "flex", alignItems: "center", color, fontWeight: 600, fontSize: "0.95rem", gap: "0.5rem" }}>
          Go there <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
