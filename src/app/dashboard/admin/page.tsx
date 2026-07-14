"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Store, CalendarCheck, DollarSign } from "lucide-react";
import { adminApi, type AdminStats } from "@/lib/admin";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to load admin stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: "0.5rem" }} />
        <Skeleton width="400px" height="20px" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Skeleton width="48px" height="48px" borderRadius="12px" />
            <div style={{ flex: 1 }}>
              <Skeleton width="100px" height="12px" style={{ marginBottom: "0.5rem" }} />
              <Skeleton width="60px" height="28px" />
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "2rem", borderRadius: "8px" }}>
        <Skeleton width="300px" height="24px" style={{ marginBottom: "1.5rem" }} />
        <Skeleton width="100%" height="400px" />
      </div>
    </div>
  );
  
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  if (!stats) return null;

  const kpis = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#3B82F6" },
    { label: "Verified Vendors", value: stats.totalVendors, icon: Store, color: "#10B981" },
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "#8B5CF6" },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "#F59E0B" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Admin Overview</h1>
        <p style={{ color: "var(--gray-500)", margin: 0 }}>
          Welcome back, {session?.user.name}. Here's what's happening on ServiceHub.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "1.5rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${kpi.color}15`, color: kpi.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <kpi.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--gray-900)", lineHeight: 1 }}>
                {kpi.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", padding: "2rem", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem" }}>Booking Trends (Last 30 Days)</h2>
        <div style={{ height: "400px" }}>
          {stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--orange)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--gray-500)", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--gray-500)", fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "var(--orange)", fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="bookings" stroke="var(--orange)" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--gray-500)" }}>
              Not enough data to display chart.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
