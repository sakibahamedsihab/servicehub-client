import { Skeleton } from "@/components/ui/Skeleton";
import { Plus } from "lucide-react";

export default function ServicesLoading() {
  return (
    <div style={{ maxWidth: "1200px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem" }}>
        <div>
          <Skeleton width="300px" height="32px" style={{ marginBottom: "0.5rem" }} />
          <Skeleton width="450px" height="20px" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--orange)", color: "#fff", padding: "0.75rem 1.25rem", borderRadius: "8px", opacity: 0.6 }}>
          <Plus size={18} />
          Add New Service
        </div>
      </header>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--border)" }}>
            <tr>
              <th style={{ padding: "1rem 1.5rem" }}><Skeleton width="100px" height="14px" /></th>
              <th style={{ padding: "1rem 1.5rem" }}><Skeleton width="60px" height="14px" /></th>
              <th style={{ padding: "1rem 1.5rem" }}><Skeleton width="80px" height="14px" /></th>
              <th style={{ padding: "1rem 1.5rem" }}><Skeleton width="80px" height="14px" /></th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}><Skeleton width="60px" height="14px" style={{ marginLeft: "auto" }} /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Skeleton width="48px" height="48px" borderRadius="6px" />
                    <div>
                      <Skeleton width="150px" height="16px" style={{ marginBottom: "0.25rem" }} />
                      <Skeleton width="100px" height="14px" />
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <Skeleton width="60px" height="16px" />
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <Skeleton width="80px" height="16px" />
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <Skeleton width="80px" height="24px" borderRadius="100px" />
                </td>
                <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                  <Skeleton width="36px" height="36px" borderRadius="6px" style={{ marginLeft: "auto" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
