import { http } from "./http";
import type { CreateReviewInput } from "../schemas/review.schema";

export interface Review {
  _id: string;
  bookingId: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

export const reviewsApi = {
  /**
   * Create a review for a completed booking.
   */
  create: (data: CreateReviewInput) => 
    http.post<{ _id: string }>("/api/reviews", data),

  /**
   * Fetch a paginated list of reviews for a specific service.
   */
  getServiceReviews: (serviceId: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return http.get<PaginatedReviews>(`/api/services/${serviceId}/reviews${qs ? `?${qs}` : ""}`, { auth: false });
  },
};
