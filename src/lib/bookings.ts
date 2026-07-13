import { http } from "./http";
import type { CreateBookingInput } from "../schemas/booking.schema";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected";

export interface Booking {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBookings {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}

export const bookingsApi = {
  /**
   * Create a new booking (Customer only).
   */
  create: (data: CreateBookingInput) => 
    http.post<{ _id: string }>("/api/bookings", data),

  /**
   * Fetch bookings made by the current customer.
   */
  getMyBookings: (params?: { status?: BookingStatus; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return http.get<PaginatedBookings>(`/api/bookings/my${qs ? `?${qs}` : ""}`);
  },

  /**
   * Fetch bookings received by the current vendor.
   */
  getVendorBookings: (params?: { status?: BookingStatus; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return http.get<PaginatedBookings>(`/api/bookings/vendor${qs ? `?${qs}` : ""}`);
  },

  /**
   * Update the status of a booking (Vendor only).
   */
  updateStatus: (id: string, status: BookingStatus) => 
    http.patch<Booking>(`/api/bookings/${id}/status`, { status }),

  /**
   * Cancel a booking (Customer or Vendor).
   */
  cancel: (id: string) => 
    http.patch<Booking>(`/api/bookings/${id}/cancel`, {}),
};
