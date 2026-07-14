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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton width="300px" height="32px" className="mb-2" />
        <Skeleton width="400px" height="20px" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border-2 border-gray-200 p-6 rounded-xl flex items-center gap-6">
            <Skeleton width="48px" height="48px" borderRadius="12px" />
            <div className="flex-1">
              <Skeleton width="100px" height="12px" className="mb-2" />
              <Skeleton width="60px" height="28px" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border-2 border-gray-200 p-8 rounded-xl">
        <Skeleton width="300px" height="24px" className="mb-6" />
        <Skeleton width="100%" height="400px" />
      </div>
    </div>
  );
  
  if (error) return <div className="p-8 text-red-600 font-medium">{error}</div>;
  if (!stats) return null;

  const kpis = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#3B82F6" },
    { label: "Verified Vendors", value: stats.totalVendors, icon: Store, color: "#10B981" },
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "#8B5CF6" },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "#F59E0B" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold m-0 mb-2">Admin Overview</h1>
        <p className="text-gray-500 m-0">
          Welcome back, {session?.user.name}. Here's what's happening on ServiceHub.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white border-2 border-gray-200 p-6 rounded-xl flex items-center gap-6 shadow-sm">
            <div style={{ background: `${kpi.color}15`, color: kpi.color }} className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
              <kpi.icon size={24} />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                {kpi.label}
              </div>
              <div className="text-3xl font-black text-gray-900 leading-none">
                {kpi.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-2 border-gray-200 p-6 md:p-8 rounded-xl shadow-sm">
        <h2 className="text-xl font-extrabold mb-6">Booking Trends (Last 30 Days)</h2>
        <div className="h-[400px]">
          {stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97757" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D97757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#737373", fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "#D97757", fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#D97757" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Not enough data to display chart.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
