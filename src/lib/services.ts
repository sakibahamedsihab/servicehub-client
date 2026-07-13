import { http } from "./http";
import type { CreateServiceInput, UpdateServiceInput } from "../schemas/service.schema";

export interface Service {
  _id: string;
  vendorId: string;
  title: string;
  description: string;
  categoryId: string;
  price: number;
  durationMinutes: number;
  images: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedServices {
  services: Service[];
  total: number;
  page: number;
  limit: number;
}

export interface Slot {
  startTime: string;
  endTime: string;
}

export interface ServiceSlots {
  date: string;
  serviceId: string;
  slots: Slot[];
}

export const servicesApi = {
  /**
   * Fetch a paginated list of services.
   * Can be filtered by category, minPrice, maxPrice, and sorted.
   */
  list: (params?: {
    category?: string;
    vendorId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: "price" | "priceDesc" | "rating" | "createdAt";
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.vendorId) query.append("vendorId", params.vendorId);
    if (params?.minPrice) query.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice) query.append("maxPrice", params.maxPrice.toString());
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return http.get<PaginatedServices>(`/api/services${qs ? `?${qs}` : ""}`, { auth: false });
  },

  /**
   * Fetch a single service by ID.
   */
  getById: (id: string) => 
    http.get<Service>(`/api/services/${id}`, { auth: false }),

  /**
   * Create a new service. (Vendor only)
   */
  create: (data: CreateServiceInput) => 
    http.post<{ _id: string }>("/api/services", data),

  /**
   * Update an existing service. (Vendor only)
   */
  update: (id: string, data: UpdateServiceInput) => 
    http.put<Service>(`/api/services/${id}`, data),

  /**
   * Soft-delete a service. (Vendor only)
   */
  delete: (id: string) => 
    http.delete<void>(`/api/services/${id}`),

  /**
   * Get available slots for a service on a specific date.
   * @param date - format: YYYY-MM-DD
   */
  getSlots: (id: string, date: string) => 
    http.get<ServiceSlots>(`/api/services/${id}/slots?date=${date}`, { auth: false }),
};
