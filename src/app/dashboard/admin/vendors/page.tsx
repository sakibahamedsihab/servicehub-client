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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Skeleton width="300px" height="32px" className="mb-2" />
        <Skeleton width="400px" height="20px" />
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b-2 border-gray-200 flex gap-4">
          <Skeleton width="150px" height="14px" />
          <Skeleton width="200px" height="14px" />
          <Skeleton width="80px" height="14px" />
          <Skeleton width="100px" height="14px" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex gap-12">
              <div>
                <Skeleton width="160px" height="18px" className="mb-1.5" />
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
  
  if (error) return <div className="p-8 text-red-600 font-medium">{error}</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 m-0 mb-2">Manage Vendors</h1>
          <p className="text-gray-500 m-0">Review vendor profiles and manage verification badges.</p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-b border-gray-200">
                <td className="p-4 font-semibold text-gray-900">
                  <div>
                    <Link href={`/vendors/${vendor.userId}`} target="_blank" className="text-inherit no-underline hover:text-orange-500 transition-colors">
                      {vendor.businessName}
                    </Link>
                    <div className="text-xs text-gray-500 font-normal mt-1">
                      Joined {format(new Date(vendor.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {vendor.categories.join(", ")}
                </td>
                <td className="p-4">
                  <div>
                    <span className="text-orange-500 font-bold">★ {vendor.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm ml-1">({vendor.reviewCount})</span>
                  </div>
                </td>
                <td className="p-4">
                  {vendor.isVerified ? (
                    <span className="bg-emerald-100/50 text-emerald-600 px-2 py-1 text-xs rounded font-bold">VERIFIED</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded font-semibold">PENDING</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant={vendor.isVerified ? "secondary" : "primary"} 
                    onClick={() => handleToggleVerification(vendor._id, vendor.isVerified)}
                    size="sm"
                  >
                    {vendor.isVerified ? "Revoke Verification" : "Verify Vendor"}
                  </Button>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {vendors.map((vendor) => (
          <div key={vendor._id} className="bg-white border-2 border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden">
            {/* Status indicator bar at top */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${vendor.isVerified ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            
            <div>
              <div className="flex justify-between items-start mb-1 mt-1">
                <Link href={`/vendors/${vendor.userId}`} target="_blank" className="text-lg font-bold text-gray-900 no-underline hover:text-orange-500 transition-colors">
                  {vendor.businessName}
                </Link>
                {vendor.isVerified ? (
                  <span className="bg-emerald-100/50 text-emerald-600 px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wide">VERIFIED</span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wide">PENDING</span>
                )}
              </div>
              <p className="text-xs text-gray-500 m-0">
                Joined {format(new Date(vendor.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider m-0 mb-1">Categories</p>
                <p className="m-0 text-gray-700 font-medium leading-tight">{vendor.categories.join(", ")}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider m-0 mb-1">Rating</p>
                <p className="m-0 text-gray-700 font-medium">
                  <span className="text-orange-500 font-bold">★ {vendor.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({vendor.reviewCount})</span>
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                variant={vendor.isVerified ? "secondary" : "primary"} 
                onClick={() => handleToggleVerification(vendor._id, vendor.isVerified)}
                className="w-full text-sm py-2.5"
              >
                {vendor.isVerified ? "Revoke Verification" : "Verify Vendor"}
              </Button>
            </div>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center text-gray-500">
            No vendors found.
          </div>
        )}
      </div>
    </div>
  );
}
