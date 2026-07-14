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
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to parse session (likely corrupted cookie):", error);
  }

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = session.user as any;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar 
        userRole={(user.role === "user" ? "customer" : user.role) as "customer" | "vendor" | "admin" ?? "customer"} 
        userName={user.name} 
        userEmail={user.email} 
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
        <div className="mt-16 lg:mt-0 block">
          {children}
        </div>
      </main>
    </div>
  );
}
