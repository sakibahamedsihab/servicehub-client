import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VendorStats } from "@/components/dashboard/VendorStats";
import { CustomerStats } from "@/components/dashboard/CustomerStats";

export default async function DashboardOverview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as any;
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Welcome back, {user.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-lg text-gray-500 m-0">
          Here's an overview of your {user.role} account.
        </p>
      </header>

      {user.role === "vendor" && (
        <>
          <VendorStats />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
              title="Manage Services" 
              desc="Add, edit, or remove your offered services." 
              link="/dashboard/services" 
              color="bg-pink-500"
              textColor="text-pink-500"
              icon="🛍️" 
            />
            <DashboardCard 
              title="Booking Requests" 
              desc="Review and accept incoming appointments." 
              link="/dashboard/booking-requests" 
              color="bg-purple-500"
              textColor="text-purple-500"
              icon="📅" 
            />
            <DashboardCard 
              title="Availability" 
              desc="Set your working hours and exceptions." 
              link="/dashboard/availability" 
              color="bg-emerald-500"
              textColor="text-emerald-500"
              icon="⏱️" 
            />
          </div>
        </>
      )}

      {(user.role === "customer" || user.role === "user") && (
        <>
          <CustomerStats />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DashboardCard 
              title="My Bookings" 
              desc="View your upcoming and past appointments." 
              link="/dashboard/bookings" 
              color="bg-blue-500"
              textColor="text-blue-500"
              icon="🎟️" 
            />
            <DashboardCard 
              title="Explore Services" 
              desc="Find new professionals to book." 
              link="/services" 
              color="bg-amber-500"
              textColor="text-amber-500"
              icon="🔍" 
            />
          </div>
        </>
      )}

      {user.role === "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Admin Overview" 
            desc="View platform statistics and charts." 
            link="/dashboard/admin" 
            color="bg-blue-500"
            textColor="text-blue-500"
            icon="📊" 
          />
          <DashboardCard 
            title="Verify Vendors" 
            desc="Review and approve new vendor accounts." 
            link="/dashboard/admin/vendors" 
            color="bg-red-500"
            textColor="text-red-500"
            icon="🛡️" 
          />
          <DashboardCard 
            title="Manage Users" 
            desc="View all registered users on the platform." 
            link="/dashboard/admin/users" 
            color="bg-sky-500"
            textColor="text-sky-500"
            icon="👥" 
          />
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, desc, link, color, textColor, icon }: { title: string, desc: string, link: string, color: string, textColor: string, icon: string }) {
  return (
    <Link href={link} className="no-underline group">
      <div className="bg-white border border-gray-200 p-6 h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden rounded-xl">
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${color}`} />
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 m-0 mb-6">{desc}</p>
        <div className={`flex items-center font-bold text-sm gap-2 ${textColor}`}>
          Go there <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
