import { http } from "./http";
import type { VendorProfile } from "./vendors";

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
  totalRevenue: number;
  chartData: { date: string; bookings: number }[];
}

export const adminApi = {
  /**
   * Get basic aggregated stats for the admin dashboard.
   */
  getStats: () => 
    http.get<AdminStats>("/api/admin/stats"),

  /**
   * Get all vendor profiles for admin management.
   */
  getVendors: () => 
    http.get<VendorProfile[]>("/api/admin/vendors"),

  /**
   * Verify or unverify a vendor profile.
   */
  verifyVendor: (id: string, isVerified: boolean) => 
    http.patch<VendorProfile>(`/api/admin/vendors/${id}/verify`, { isVerified }),
};
