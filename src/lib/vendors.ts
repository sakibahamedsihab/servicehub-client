import { http } from "./http";
import type { CreateVendorProfileInput, UpdateVendorProfileInput } from "../schemas/vendorProfile.schema";

export interface VendorProfile {
  _id: string;
  userId: string;
  businessName: string;
  bio: string;
  categories: string[];
  contactEmail: string;
  contactPhone: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedVendors {
  vendors: VendorProfile[];
  total: number;
  page: number;
  limit: number;
}

export const vendorsApi = {
  /**
   * Fetch a paginated list of verified vendors.
   */
  list: (params?: { category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return http.get<PaginatedVendors>(`/api/vendors${qs ? `?${qs}` : ""}`, { auth: false });
  },

  /**
   * Fetch a single vendor profile by vendor ID or user ID.
   */
  getById: (id: string) => 
    http.get<VendorProfile>(`/api/vendors/${id}`, { auth: false }),

  /**
   * Create a vendor profile for the currently logged in user.
   */
  createProfile: (data: CreateVendorProfileInput) => 
    http.post<{ _id: string }>("/api/vendors/profile", data),

  /**
   * Update the logged in vendor's profile.
   */
  updateProfile: (data: UpdateVendorProfileInput) => 
    http.put<VendorProfile>("/api/vendors/profile", data),
};
