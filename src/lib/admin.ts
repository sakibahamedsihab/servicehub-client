import { http } from "./http";
import type { VendorProfile } from "./vendors";

export const adminApi = {
  /**
   * Fetch all vendors on the platform.
   */
  listVendors: () => 
    http.get<VendorProfile[]>("/api/admin/vendors"),

  /**
   * Toggle the verification status of a vendor.
   */
  verifyVendor: (vendorId: string) => 
    http.patch<VendorProfile>(`/api/admin/vendors/${vendorId}/verify`, {}),
};
