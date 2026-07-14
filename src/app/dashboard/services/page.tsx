import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, CheckCircle2, XCircle, Pencil, Search, Image as ImageIcon } from "lucide-react";
import type { PaginatedServices, Service } from "@/lib/services";
import { DeleteServiceButton } from "@/components/dashboard/DeleteServiceButton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function fetchMyServices(vendorId: string): Promise<Service[]> {
  // Pass a large limit to get all services for management, or we could add pagination
  const res = await fetch(`${API_BASE}/api/services?vendorId=${vendorId}&limit=100`, { cache: "no-store" });
  if (!res.ok) return [];
  const data: PaginatedServices = await res.json();
  return data.services;
}

export default async function VendorServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user || (session.user as any).role !== "vendor") return null;

  const services = await fetchMyServices(session.user.id);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Manage Services
          </h1>
          <p className="text-lg text-gray-500 m-0">
            Create and manage the services you offer to customers.
          </p>
        </div>
        <Link 
          href="/dashboard/services/create" 
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white no-underline px-5 py-3 rounded-lg font-bold text-sm transition-colors w-full md:w-auto justify-center"
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </header>

      {services.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-500 mx-auto mb-6 max-w-md leading-relaxed">
            You haven't listed any services yet. Create your first service to start accepting bookings from customers.
          </p>
          <Link 
            href="/dashboard/services/create" 
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white no-underline px-6 py-3 rounded-lg font-bold transition-colors"
          >
            <Plus size={18} />
            Create First Service
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="p-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="p-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="p-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, idx) => (
                  <tr key={service._id} className={`${idx === services.length - 1 ? 'border-none' : 'border-b border-gray-200'}`}>
                    <td className="p-4 md:px-6">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                          {service.images && service.images.length > 0 ? (
                            <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="m-0 mb-1 font-bold text-gray-900 text-base">{service.title}</p>
                          <p className="m-0 text-sm text-gray-500">{service.categoryId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:px-6 font-bold text-gray-900">
                      ${service.price}
                    </td>
                    <td className="p-4 md:px-6 text-gray-700">
                      {service.durationMinutes} min
                    </td>
                    <td className="p-4 md:px-6">
                      {service.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 text-emerald-600 rounded-full text-xs font-bold">
                          <CheckCircle2 size={14} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                          <XCircle size={14} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 md:px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/services/${service._id}/edit`} className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-50 text-gray-600 border border-gray-200 transition-colors hover:bg-gray-100 hover:text-orange-500 no-underline" title="Edit Service">
                          <Pencil size={16} />
                        </Link>
                        <DeleteServiceButton serviceId={service._id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {services.map((service) => (
              <div key={service._id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {service.images && service.images.length > 0 ? (
                      <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="m-0 mb-1 font-bold text-gray-900 text-base truncate">{service.title}</p>
                    <p className="m-0 mb-2 text-sm text-gray-500">{service.categoryId}</p>
                    {service.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100/50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                        <XCircle size={12} /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/dashboard/services/${service._id}/edit`} className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-orange-50 text-orange-600 transition-colors no-underline">
                      <Pencil size={14} />
                    </Link>
                    <DeleteServiceButton serviceId={service._id} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 divide-x divide-gray-100 bg-gray-50">
                  <div className="p-3 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price</span>
                    <span className="font-extrabold text-gray-900">${service.price}</span>
                  </div>
                  <div className="p-3 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                    <span className="font-bold text-gray-700">{service.durationMinutes} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
