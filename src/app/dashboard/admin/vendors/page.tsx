"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { adminApi } from "@/lib/admin";
import type { VendorProfile } from "@/lib/vendors";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getVendors();
      setVendors(data);
    } catch (err: any) {
      setError(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleVerification = async (vendorId: string, currentStatus: boolean) => {
    try {
      const updated = await adminApi.verifyVendor(vendorId, !currentStatus);
      setVendors(vendors.map(v => v._id === vendorId ? updated : v));
      toast.success(currentStatus ? "Vendor verification revoked" : "Vendor successfully verified");
    } catch (err: any) {
      toast.error("Failed to update verification: " + err.message);
    }
  };

  if (loading && vendors.length === 0) return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Skeleton width="300px" height="32px" style={{ marginBottom: "0.5rem" }} />
        <Skeleton width="400px" height="20px" />
      </div>
      <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ background: "var(--gray-50)", padding: "1rem", borderBottom: "1.5px solid var(--border)", display: "flex", gap: "1rem" }}>
          <Skeleton width="150px" height="14px" />
          <Skeleton width="200px" height="14px" />
          <Skeleton width="80px" height="14px" />
          <Skeleton width="100px" height="14px" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "3rem" }}>
              <div>
                <Skeleton width="160px" height="18px" style={{ marginBottom: "6px" }} />
                <Skeleton width="100px" height="12px" />
              </div>
              <Skeleton width="180px" height="16px" />
              <Skeleton width="80px" height="16px" />
              <Skeleton width="100px" height="24px" borderRadius="4px" />
            </div>
            <Skeleton width="120px" height="32px" borderRadius="6px" />
          </div>
        ))}
      </div>
    </div>
  );
  
  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Manage Vendors</h1>
          <p style={{ color: "var(--gray-500)", margin: 0 }}>Review vendor profiles and manage verification badges.</p>
        </div>
      </div>

      <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)", borderBottom: "1.5px solid var(--border)" }}>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Business Name</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Categories</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Rating</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Status</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1rem", fontWeight: 600, color: "var(--gray-900)" }}>
                  <Link href={`/vendors/${vendor.userId}`} target="_blank" style={{ color: "inherit", textDecoration: "none" }}>
                    {vendor.businessName}
                  </Link>
                  <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", fontWeight: 400 }}>
                    Joined {format(new Date(vendor.createdAt), "MMM d, yyyy")}
                  </div>
                </td>
                <td style={{ padding: "1rem", color: "var(--gray-600)", fontSize: "0.9rem" }}>
                  {vendor.categories.join(", ")}
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ color: "var(--orange)", fontWeight: 700 }}>★ {vendor.rating.toFixed(1)}</span>
                  <span style={{ color: "var(--gray-500)", fontSize: "0.85rem", marginLeft: "4px" }}>({vendor.reviewCount})</span>
                </td>
                <td style={{ padding: "1rem" }}>
                  {vendor.isVerified ? (
                    <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "4px 8px", fontSize: "0.8rem", borderRadius: "4px", fontWeight: 700 }}>VERIFIED</span>
                  ) : (
                    <span style={{ background: "var(--gray-100)", color: "var(--gray-600)", padding: "4px 8px", fontSize: "0.8rem", borderRadius: "4px", fontWeight: 600 }}>PENDING</span>
                  )}
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <Button 
                    variant={vendor.isVerified ? "secondary" : "primary"} 
                    onClick={() => handleToggleVerification(vendor._id, vendor.isVerified)}
                    style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                  >
                    {vendor.isVerified ? "Revoke Verification" : "Verify Vendor"}
                  </Button>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--gray-500)" }}>
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
