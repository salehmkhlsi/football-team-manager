"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  Settings,
  LogOut,
  Menu,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const sidebarItems = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "بازیکنان",
    href: "/dashboard/players",
    icon: Users,
  },
  {
    title: "ارزیابی‌ها",
    href: "/dashboard/evaluations",
    icon: ClipboardList,
  },
  {
    title: "حضور و غیاب",
    href: "/dashboard/attendance",
    icon: Calendar,
  },
  {
    title: "مالی و اشتراک",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    title: "تنظیمات",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    // Simply redirect to login page since we're using hardcoded data
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 w-64 h-screen transition-transform bg-white border-l",
          !isSidebarOpen && "translate-x-full"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-8 px-2">
            <h2 className="text-2xl font-bold text-black">آکادمی فوتبال</h2>
          </div>
          <ul className="space-y-2 font-medium">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100",
                    pathname === item.href && "bg-gray-100"
                  )}
                >
                  <item.icon className="w-6 h-6 ml-2 text-gray-500" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleSignOut}
              >
                <LogOut className="w-6 h-6 ml-2" />
                خروج
              </Button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <div className="sticky top-0 z-30 flex h-16 w-full bg-white border-b lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="px-4"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "mr-64" : "mr-0"
        )}
      >
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
