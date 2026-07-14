"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Briefcase,
  Users,
  ShieldCheck,
  Clock,
  Menu,
  X,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  userRole: "customer" | "vendor" | "admin";
  userName: string;
  userEmail: string;
}

export function DashboardSidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation in mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const getLinks = () => {
    switch (userRole) {
      case "vendor":
        return [
          { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
          { name: "My Services", href: "/dashboard/services", icon: Briefcase },
          { name: "Availability", href: "/dashboard/availability", icon: Clock },
          { name: "Booking Requests", href: "/dashboard/booking-requests", icon: Calendar },
          { name: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
          { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
        ];
      case "admin":
        return [
          { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
          { name: "Vendors", href: "/dashboard/admin/vendors", icon: ShieldCheck },
          { name: "Users", href: "/dashboard/admin/users", icon: Users },
          { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
        ];
      case "customer":
      default:
        return [
          { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
          { name: "My Bookings", href: "/dashboard/bookings", icon: Calendar },
          { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between px-4 z-50 border-b border-gray-800 lg:hidden">
        <Link href="/" className="text-white font-extrabold text-xl no-underline">
          Service<span className="text-orange-500">Hub</span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="bg-transparent border-none text-white cursor-pointer p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-gray-900 text-white flex flex-col 
        transition-transform duration-300 ease-in-out z-45 border-r border-gray-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        <div className="p-8 pb-6 border-b border-gray-800 pt-20 lg:pt-8">
          <Link href="/" className="hidden lg:block text-white font-black text-2xl no-underline mb-8">
            Service<span className="text-orange-500">Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shrink-0">
              <UserIcon size={24} className="text-orange-500" />
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm m-0 mb-1 whitespace-nowrap text-ellipsis overflow-hidden">{userName}</p>
              <p className="text-xs text-gray-400 m-0 capitalize">{userRole} Account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 px-4 overflow-y-auto flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 no-underline
                  ${isActive ? "bg-orange-500/15 text-orange-500 font-semibold" : "text-gray-300 font-medium hover:bg-gray-800 hover:text-white"}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  {link.name}
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 px-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-transparent text-gray-400 border-none cursor-pointer font-medium text-base transition-all duration-200 text-left hover:bg-gray-800 hover:text-red-500"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
