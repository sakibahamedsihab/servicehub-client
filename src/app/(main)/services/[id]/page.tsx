import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { RelatedServices } from "@/components/services/RelatedServices";
import type { Service } from "@/lib/services";
import type { VendorProfile } from "@/lib/vendors";
import { Button } from "@/components/ui/Button";
import { ServiceReviews } from "@/components/services/ServiceReviews";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { SlotPicker } from "@/components/services/SlotPicker";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function fetchServiceAndVendor(id: string): Promise<{ service: Service; vendor: VendorProfile } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/services/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const service: Service = await res.json();

    const vendorRes = await fetch(`${API_BASE}/api/vendors/${service.vendorId}`, { cache: "no-store" });
    const vendor: VendorProfile = vendorRes.ok ? await vendorRes.json() : null;

    return { service, vendor };
  } catch (error) {
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const data = await fetchServiceAndVendor(id);
  if (!data) return { title: "Not Found — ServiceHub" };
  return {
    title: `${data.service.title} — ServiceHub`,
    description: data.service.description.substring(0, 160),
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;
  const data = await fetchServiceAndVendor(id);

  if (!data) {
    notFound();
  }

  const { service, vendor } = data;
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user as any;
  const isOwner = user?.id === service.vendorId;

  return (
    <main className="pt-16 min-h-screen bg-gray-50 pb-16">
      {/* Header Banner */}
      <div className="bg-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block bg-orange-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            {service.categoryId}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white m-0 mb-4 tracking-tight leading-tight">
            {service.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-orange-500 text-xl">★</span>
              <span className="text-white font-bold">{(service.rating || 0).toFixed(1)}</span>
              <span className="text-gray-400 text-sm">({service.reviewCount || 0} reviews)</span>
            </div>
            {vendor && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-white text-sm flex items-center gap-1.5">
                  <span>🏢</span> {vendor.businessName}
                  {vendor.isVerified && (
                    <span className="bg-orange-500/20 text-orange-500 px-1.5 py-0.5 text-xs font-bold ml-1">VERIFIED</span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Column */}
          <div className="flex flex-col gap-8 flex-1 w-full lg:w-2/3">
            
            {/* Image Gallery Placeholder */}
            <div className="border-2 border-gray-200 bg-white p-2">
              <div className="h-[300px] md:h-[400px] bg-gradient-to-br from-orange-100 to-gray-100 relative">
                {service.images?.[0] ? (
                  <img src={service.images[0]} alt="Primary" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No images provided</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border-2 border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">About This Service</h2>
              <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                {service.description}
              </div>
            </div>

            {/* Vendor Profile Snippet */}
            {vendor && (
              <div className="bg-white border-2 border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6">About The Vendor</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-2xl shrink-0">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-lg font-bold m-0 mb-1">
                      <Link href={`/vendors/${vendor.userId}`} className="text-gray-900 no-underline hover:text-orange-500 transition-colors">
                        {vendor.businessName}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 m-0 mb-4">Member since {new Date(vendor.createdAt).getFullYear()}</p>
                    <p className="text-base text-gray-700 leading-relaxed m-0">
                      {vendor.bio || "No bio provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            <ServiceReviews serviceId={service._id} />
          </div>

          {/* Right Sticky Column (Booking Card) */}
          <div className="sticky top-24 w-full lg:w-1/3 shrink-0">
            <div className="bg-white border-2 border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-baseline mb-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Price</div>
                  <div className="text-3xl font-extrabold text-gray-900 leading-none">${service.price}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Duration</div>
                  <div className="text-xl font-bold text-gray-700 leading-none">{service.durationMinutes} min</div>
                </div>
              </div>

              {/* Slot Picker Component (Task 7.4) */}
              {isOwner ? (
                <div className="bg-orange-50 text-orange-700 p-4 rounded-lg font-bold text-center border border-orange-200 shadow-inner">
                  You cannot book your own service.
                </div>
              ) : (
                <SlotPicker serviceId={service._id} vendorId={service.vendorId} />
              )}
            </div>
          </div>
        </div>

        {/* Related Services */}
        <Suspense fallback={<div className="mt-16 h-[300px] bg-gray-100 animate-pulse rounded-xl" />}>
          <RelatedServices category={service.categoryId} currentId={service._id} />
        </Suspense>
      </div>
    </main>
  );
}
