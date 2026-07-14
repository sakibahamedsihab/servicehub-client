"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";
import { bookingsApi } from "@/lib/bookings";
import { servicesApi } from "@/lib/services";
import type { Booking, BookingStatus } from "@/lib/bookings";
import type { Service } from "@/lib/services";
import { Button } from "@/components/ui/Button";
import { ReviewForm } from "./ReviewForm";

interface BookingCardProps {
  booking: Booking;
  role: "vendor" | "customer";
  onStatusChange: (id: string, newStatus: BookingStatus) => void;
}

const STATUS_COLORS: Record<BookingStatus, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#D97706" }, // Amber
  confirmed: { bg: "#DBEAFE", text: "#2563EB" }, // Blue
  completed: { bg: "#D1FAE5", text: "#059669" }, // Green
  cancelled: { bg: "#F3F4F6", text: "#6B7280" }, // Gray
  rejected: { bg: "#FEE2E2", text: "#DC2626" }, // Red
};

export function BookingCard({ booking, role, onStatusChange }: BookingCardProps) {
  const [service, setService] = useState<Service | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    servicesApi.getById(booking.serviceId)
      .then(setService)
      .catch(() => {});
  }, [booking.serviceId]);

  const handleAction = async (action: "accept" | "reject" | "complete" | "cancel") => {
    setLoadingAction(action);
    setActionError(null);
    try {
      if (action === "cancel") {
        await bookingsApi.cancel(booking._id);
        onStatusChange(booking._id, "cancelled");
      } else {
        const newStatus = action === "accept" ? "confirmed" : action === "reject" ? "rejected" : "completed";
        await bookingsApi.updateStatus(booking._id, newStatus);
        onStatusChange(booking._id, newStatus);
      }
    } catch (err: any) {
      setActionError(err.message || `Failed to ${action} booking`);
    } finally {
      setLoadingAction(null);
    }
  };

  const colors = STATUS_COLORS[booking.status];

  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1.5rem", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <div>
            <span style={{ 
              display: "inline-block", 
              padding: "0.25rem 0.75rem", 
              borderRadius: "100px", 
              background: colors.bg, 
              color: colors.text, 
              fontSize: "0.8rem", 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: "0.05em",
              marginBottom: "0.75rem"
            }}>
              {booking.status}
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", margin: "0 0 0.5rem 0" }}>
              {service ? service.title : "Loading service..."}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", color: "var(--gray-600)", fontSize: "0.95rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={16} /> {format(new Date(booking.date), "MMMM d, yyyy")}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Clock size={16} /> {booking.startTime} - {booking.endTime}
              </span>
            </div>
          </div>
          
          <div style={{ textAlign: "right", color: "var(--gray-500)", fontSize: "0.85rem" }}>
            Booking ID: <br />
            <span style={{ fontFamily: "monospace", color: "var(--gray-700)" }}>{booking._id.slice(-8).toUpperCase()}</span>
          </div>
        </div>

        {booking.notes && (
          <div style={{ background: "var(--gray-50)", padding: "1rem", borderRadius: "8px", display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <FileText size={18} color="var(--gray-500)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <span style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Notes from Customer</span>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--gray-700)", lineHeight: 1.5 }}>{booking.notes}</p>
            </div>
          </div>
        )}

        {actionError && (
          <div style={{ marginTop: "1rem", background: "#FEF2F2", color: "#DC2626", padding: "0.75rem", borderRadius: "8px", border: "1px solid #FECACA", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={16} /> {actionError}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {role === "vendor" && (booking.status === "pending" || booking.status === "confirmed") && (
        <div style={{ padding: "1rem 1.5rem", background: "var(--gray-50)", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
          {booking.status === "pending" && (
            <>
              <Button variant="danger" size="sm" onClick={() => handleAction("reject")} loading={loadingAction === "reject"} disabled={loadingAction !== null && loadingAction !== "reject"} style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}>
                <XCircle size={16} /> Reject
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleAction("accept")} loading={loadingAction === "accept"} disabled={loadingAction !== null && loadingAction !== "accept"} style={{ background: "#D1FAE5", color: "#059669", border: "1px solid #A7F3D0" }}>
                <CheckCircle size={16} /> Accept Request
              </Button>
            </>
          )}
          {booking.status === "confirmed" && (
            <>
              <Button variant="secondary" size="sm" onClick={() => handleAction("cancel")} loading={loadingAction === "cancel"} disabled={loadingAction !== null && loadingAction !== "cancel"}>
                <XCircle size={16} /> Cancel Booking
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleAction("complete")} loading={loadingAction === "complete"} disabled={loadingAction !== null && loadingAction !== "complete"}>
                <CheckCircle size={16} /> Mark as Completed
              </Button>
            </>
          )}
        </div>
      )}

      {role === "customer" && (booking.status === "pending" || booking.status === "confirmed") && (
        <div style={{ padding: "1rem 1.5rem", background: "var(--gray-50)", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <Button variant="danger" size="sm" onClick={() => handleAction("cancel")} loading={loadingAction === "cancel"} disabled={loadingAction !== null && loadingAction !== "cancel"}>
            <XCircle size={16} /> Cancel Booking
          </Button>
        </div>
      )}
      {role === "customer" && booking.status === "completed" && !hasReviewed && (
        <div style={{ padding: "1rem 1.5rem", background: "var(--white)", borderTop: "1px solid var(--border)" }}>
          {!isReviewing ? (
            <Button variant="secondary" onClick={() => setIsReviewing(true)}>
              Leave a Review
            </Button>
          ) : (
            <ReviewForm
              bookingId={booking._id}
              onCancel={() => setIsReviewing(false)}
              onSuccess={() => {
                setIsReviewing(false);
                setHasReviewed(true);
              }}
            />
          )}
        </div>
      )}
      
      {hasReviewed && (
        <div style={{ padding: "1rem 1.5rem", background: "#F0FDF4", color: "#166534", borderTop: "1px solid #DCFCE7", fontSize: "0.9rem", fontWeight: 600 }}>
          ✓ You have submitted a review for this booking.
        </div>
      )}
    </div>
  );
}
