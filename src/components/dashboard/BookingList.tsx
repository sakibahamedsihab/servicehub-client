"use client";

import { useEffect, useState, useCallback } from "react";
import { bookingsApi } from "@/lib/bookings";
import type { Booking, BookingStatus } from "@/lib/bookings";
import { BookingCard } from "./BookingCard";
import { Skeleton } from "@/components/ui/Skeleton";

interface BookingListProps {
  role: "vendor" | "customer";
}

export function BookingList({ role }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = statusFilter !== "all" ? { status: statusFilter } : undefined;
      const res = role === "vendor" 
        ? await bookingsApi.getVendorBookings(params)
        : await bookingsApi.getMyBookings(params);
        
      setBookings(res.bookings);
    } catch (err: any) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [role, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    setBookings((prev) => 
      prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
    );
  };

  const TABS: { label: string; value: BookingStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-5 py-2 rounded-full border font-semibold text-sm cursor-pointer transition-all whitespace-nowrap ${
              statusFilter === tab.value
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
                  <div>
                    <Skeleton width="100px" height="24px" borderRadius="100px" className="mb-3" />
                    <Skeleton width="200px" height="24px" className="mb-2" />
                    <div className="flex gap-4">
                      <Skeleton width="140px" height="16px" />
                      <Skeleton width="140px" height="16px" />
                    </div>
                  </div>
                  <Skeleton width="100px" height="32px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-200 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500 m-0">There are no bookings matching the current filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              role={role} 
              onStatusChange={handleStatusChange} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
