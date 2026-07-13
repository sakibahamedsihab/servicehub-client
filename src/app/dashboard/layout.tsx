import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const metadata = {
  title: "Dashboard — ServiceHub",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = session.user as any;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--gray-50)" }}>
      <DashboardSidebar 
        userRole={(user.role === "user" ? "customer" : user.role) as "customer" | "vendor" | "admin" ?? "customer"} 
        userName={user.name} 
        userEmail={user.email} 
      />
      
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto", minWidth: 0 }}>
        {/* Safe-area for mobile header since sidebar becomes a top-bar on mobile */}
        <div style={{ marginTop: "40px", display: "block" }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 1024px) {
              main > div:first-child {
                margin-top: 0 !important;
              }
            }
          `}} />
          {children}
        </div>
      </main>
    </div>
  );
}
