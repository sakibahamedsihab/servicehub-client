"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: Date;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // better-auth admin plugin fetch
      const res = await authClient.admin.listUsers({ query: { limit: 100 } });
      if (res.data) {
        setUsers(res.data.users as any);
      } else if (res.error) {
        setError(res.error.message || "Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId: string, currentlyBanned: boolean) => {
    if (!confirm(`Are you sure you want to ${currentlyBanned ? "unban" : "ban"} this user?`)) return;
    
    try {
      if (currentlyBanned) {
        await authClient.admin.unbanUser({ userId });
      } else {
        await authClient.admin.banUser({ userId });
      }
      // Optimistic update
      setUsers(users.map(u => u.id === userId ? { ...u, banned: !currentlyBanned } : u));
      toast.success(`User successfully ${currentlyBanned ? "unbanned" : "banned"}`);
    } catch (err: any) {
      toast.error("Failed to toggle ban status: " + err.message);
    }
  };

  if (loading && users.length === 0) return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Skeleton width="250px" height="32px" style={{ marginBottom: "0.5rem" }} />
        <Skeleton width="350px" height="20px" />
      </div>
      <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ background: "var(--gray-50)", padding: "1rem", borderBottom: "1.5px solid var(--border)", display: "flex", gap: "1rem" }}>
          <Skeleton width="100px" height="14px" />
          <Skeleton width="150px" height="14px" />
          <Skeleton width="80px" height="14px" />
          <Skeleton width="100px" height="14px" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "4rem" }}>
              <Skeleton width="120px" height="16px" />
              <Skeleton width="180px" height="16px" />
              <Skeleton width="80px" height="16px" />
              <Skeleton width="100px" height="16px" />
            </div>
            <Skeleton width="80px" height="32px" borderRadius="6px" />
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
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Manage Users</h1>
          <p style={{ color: "var(--gray-500)", margin: 0 }}>View all registered users and manage their access.</p>
        </div>
      </div>

      <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)", borderBottom: "1.5px solid var(--border)" }}>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Name</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Email</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Role</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)" }}>Joined</th>
              <th style={{ padding: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gray-500)", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--border)", opacity: user.banned ? 0.6 : 1 }}>
                <td style={{ padding: "1rem", fontWeight: 600, color: "var(--gray-900)" }}>
                  {user.name}
                  {user.banned && <span style={{ marginLeft: "0.5rem", background: "#FEF2F2", color: "#DC2626", padding: "2px 6px", fontSize: "0.7rem", borderRadius: "4px" }}>BANNED</span>}
                </td>
                <td style={{ padding: "1rem", color: "var(--gray-600)" }}>{user.email}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ background: "var(--gray-100)", padding: "4px 8px", fontSize: "0.8rem", borderRadius: "4px", fontWeight: 600, textTransform: "capitalize" }}>
                    {user.role || "customer"}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "var(--gray-500)", fontSize: "0.9rem" }}>
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  {user.role !== "admin" && (
                    <Button 
                      variant={user.banned ? "secondary" : "danger"} 
                      onClick={() => handleToggleBan(user.id, user.banned)}
                      style={{ padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
                    >
                      {user.banned ? "Unban" : "Ban"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--gray-500)" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
