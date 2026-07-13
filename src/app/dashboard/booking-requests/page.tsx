import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookingList } from "@/components/dashboard/BookingList";

export const metadata = {
  title: "Booking Requests — ServiceHub",
};

export default async function BookingRequestsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user || (session.user as any).role !== "vendor") {
    redirect("/dashboard");
  }

  return (
    <div style={{ maxWidth: "1000px" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gray-900)", marginBottom: "0.5rem" }}>
          Booking Requests
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--gray-500)", margin: 0 }}>
          Manage your incoming bookings, approve requests, and mark jobs as completed.
        </p>
      </header>

      <BookingList role="vendor" />
    </div>
  );
}
