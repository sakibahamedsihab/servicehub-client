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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
          <div>
            <span style={{ 
              background: colors.bg, 
              color: colors.text, 
            }} className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              {booking.status}
            </span>
            <h3 className="text-xl font-bold text-gray-900 m-0 mb-2">
              {service ? service.title : "Loading service..."}
            </h3>
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> {format(new Date(booking.date), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> {booking.startTime} - {booking.endTime}
              </span>
            </div>
          </div>
          
          <div className="text-right text-gray-500 text-xs">
            Booking ID: <br />
            <span className="font-mono text-gray-700">{booking._id.slice(-8).toUpperCase()}</span>
          </div>
        </div>

        {booking.notes && (
          <div className="bg-gray-50 p-4 rounded-lg flex gap-3 mt-4 border border-gray-100">
            <FileText size={18} className="text-gray-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes from Customer</span>
              <p className="m-0 text-sm text-gray-700 leading-relaxed">{booking.notes}</p>
            </div>
          </div>
        )}

        {actionError && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {actionError}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {role === "vendor" && (booking.status === "pending" || booking.status === "confirmed") && (
        <div className="p-4 px-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end flex-wrap">
          {booking.status === "pending" && (
            <>
              <Button variant="danger" size="sm" onClick={() => handleAction("reject")} loading={loadingAction === "reject"} disabled={loadingAction !== null && loadingAction !== "reject"} className="bg-red-100 text-red-600 border border-red-200 hover:bg-red-200">
                <XCircle size={16} /> Reject
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleAction("accept")} loading={loadingAction === "accept"} disabled={loadingAction !== null && loadingAction !== "accept"} className="bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200">
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
        <div className="p-4 px-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
          <Button variant="danger" size="sm" onClick={() => handleAction("cancel")} loading={loadingAction === "cancel"} disabled={loadingAction !== null && loadingAction !== "cancel"}>
            <XCircle size={16} /> Cancel Booking
          </Button>
        </div>
      )}
      {role === "customer" && booking.status === "completed" && !hasReviewed && (
        <div className="p-4 px-6 bg-white border-t border-gray-200">
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
        <div className="p-4 px-6 bg-green-50 text-green-800 border-t border-green-100 text-sm font-semibold">
          ✓ You have submitted a review for this booking.
        </div>
      )}
    </div>
  );
}
