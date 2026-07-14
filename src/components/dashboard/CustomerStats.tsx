"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { bookingsApi } from "@/lib/bookings";
import { Skeleton } from "@/components/ui/Skeleton";

export function CustomerStats() {
  const [stats, setStats] = useState({ upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await bookingsApi.getMyBookings({ limit: 1000 });
        const bookings = res.bookings;
        
        let completedCount = 0;
        let upcomingCount = 0;
        
        const now = new Date();

        for (const booking of bookings) {
          if (booking.status === "completed") {
            completedCount++;
          } else if (booking.status === "confirmed" || booking.status === "pending") {
            const bookingDate = new Date(`${booking.date}T${booking.startTime}`);
            if (bookingDate >= now) {
              upcomingCount++;
            }
          }
        }
        
        setStats({ upcoming: upcomingCount, completed: completedCount });
      } catch (err) {
        console.error("Failed to fetch customer stats:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border-2 border-gray-200 p-6 rounded-xl flex items-center gap-6">
          <Skeleton width="48px" height="48px" borderRadius="12px" />
          <div className="flex-1">
            <Skeleton width="100px" height="12px" className="mb-2" />
            <Skeleton width="60px" height="28px" />
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 p-6 rounded-xl flex items-center gap-6">
          <Skeleton width="48px" height="48px" borderRadius="12px" />
          <div className="flex-1">
            <Skeleton width="100px" height="12px" className="mb-2" />
            <Skeleton width="60px" height="28px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border-2 border-gray-200 p-6 rounded-xl flex items-center gap-6 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
          <Calendar size={24} />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            Upcoming Bookings
          </div>
          <div className="text-3xl font-black text-gray-900 leading-none">
            {stats.upcoming}
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-gray-200 p-6 rounded-xl flex items-center gap-6 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
          <CheckCircle size={24} />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
            Completed Bookings
          </div>
          <div className="text-3xl font-black text-gray-900 leading-none">
            {stats.completed}
          </div>
        </div>
      </div>
    </div>
  );
}
