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
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "100px",
              border: "1px solid",
              borderColor: statusFilter === tab.value ? "var(--orange)" : "var(--border)",
              background: statusFilter === tab.value ? "var(--orange)" : "var(--white)",
              color: statusFilter === tab.value ? "var(--white)" : "var(--gray-600)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "1.5rem", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  <div>
                    <Skeleton width="100px" height="24px" borderRadius="100px" style={{ marginBottom: "0.75rem" }} />
                    <Skeleton width="200px" height="24px" style={{ marginBottom: "0.5rem" }} />
                    <div style={{ display: "flex", gap: "1rem" }}>
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
        <div style={{ padding: "1.5rem", background: "#FEF2F2", color: "#DC2626", borderRadius: "8px", border: "1px solid #FECACA" }}>
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ padding: "4rem 2rem", textAlign: "center", background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--gray-900)", marginBottom: "0.5rem" }}>No bookings found</h3>
          <p style={{ color: "var(--gray-500)", margin: 0 }}>There are no bookings matching the current filter.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
