import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { User, Mail, Shield, AlertCircle } from "lucide-react";

export const metadata = { title: "Profile Settings — ServiceHub" };

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) return null;
  const user = session.user as any;

  return (
    <div style={{ maxWidth: "800px" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          Profile Settings
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--gray-500)" }}>
          Manage your account details and preferences.
        </p>
      </header>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <User size={20} color="var(--orange)" /> Personal Information
        </h2>
        
        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "0.5rem" }}>Full Name</label>
            <input 
              type="text" 
              defaultValue={user.name} 
              disabled
              style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--gray-50)", color: "var(--gray-500)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--gray-700)", marginBottom: "0.5rem" }}>Email Address</label>
            <input 
              type="email" 
              defaultValue={user.email} 
              disabled
              style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--gray-50)", color: "var(--gray-500)" }}
            />
          </div>
        </div>
        
        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "8px", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <AlertCircle size={20} color="#3b82f6" style={{ marginTop: "2px" }} />
          <div>
            <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.95rem", fontWeight: 600, color: "#1e3a8a" }}>Name & Email Updates</h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#1e40af", lineHeight: 1.5 }}>
              Currently, basic account details are locked for security. Please contact support to change your primary email address.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--gray-900)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={20} color="var(--orange)" /> Account Role
        </h2>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
          <div>
            <p style={{ margin: "0 0 0.25rem", fontWeight: 600, color: "var(--gray-900)", textTransform: "capitalize" }}>{user.role} Account</p>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--gray-500)" }}>Your access level determines what you can do on ServiceHub.</p>
          </div>
          {user.role === "vendor" && (
            <Link href={`/vendors/${user.id}`} style={{ textDecoration: "none", background: "var(--gray-900)", color: "#fff", padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>
              View Public Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
