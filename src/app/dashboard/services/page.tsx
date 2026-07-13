import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, CheckCircle2, XCircle, Pencil, Search, Image as ImageIcon } from "lucide-react";
import type { PaginatedServices, Service } from "@/lib/services";

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
    <div style={{ maxWidth: "1200px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
            Manage Services
          </h1>
          <p style={{ fontSize: "1.05rem", color: "var(--gray-500)", margin: 0 }}>
            Create and manage the services you offer to customers.
          </p>
        </div>
        <Link 
          href="/dashboard/services/create" 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--orange)", color: "#fff", textDecoration: "none", padding: "0.75rem 1.25rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.95rem" }}
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </header>

      {services.length === 0 ? (
        <div style={{ background: "var(--white)", border: "1px dashed var(--border)", borderRadius: "12px", padding: "4rem 2rem", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", background: "var(--gray-100)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Search size={32} color="var(--gray-400)" />
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "0.5rem" }}>No services yet</h3>
          <p style={{ color: "var(--gray-500)", margin: "0 auto 1.5rem", maxWidth: "400px", lineHeight: 1.6 }}>
            You haven't listed any services yet. Create your first service to start accepting bookings from customers.
          </p>
          <Link 
            href="/dashboard/services/create" 
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--gray-900)", color: "#fff", textDecoration: "none", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 600 }}
          >
            <Plus size={18} />
            Create First Service
          </Link>
        </div>
      ) : (
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--border)" }}>
              <tr>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Service</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Duration</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, idx) => (
                <tr key={service._id} style={{ borderBottom: idx === services.length - 1 ? "none" : "1px solid var(--border)" }}>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "6px", background: "var(--gray-100)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {service.images && service.images.length > 0 ? (
                          <img src={service.images[0]} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImageIcon size={20} color="var(--gray-400)" />
                        )}
                      </div>
                      <div>
                        <p style={{ margin: "0 0 0.25rem", fontWeight: 600, color: "var(--gray-900)", fontSize: "1rem" }}>{service.title}</p>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--gray-500)" }}>{service.categoryId}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", fontWeight: 600, color: "var(--gray-900)" }}>
                    ${service.price}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", color: "var(--gray-700)", fontSize: "0.95rem" }}>
                    {service.durationMinutes} min
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    {service.isActive ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.75rem", background: "rgba(16, 185, 129, 0.1)", color: "#059669", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Active
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.75rem", background: "var(--gray-100)", color: "var(--gray-600)", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 600 }}>
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                    <Link href={`/dashboard/services/${service._id}/edit`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "6px", background: "var(--gray-50)", color: "var(--gray-600)", border: "1px solid var(--border)", transition: "all 0.2s", textDecoration: "none" }}>
                      <Pencil size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
