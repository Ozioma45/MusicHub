// components/DashboardLayout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Music, Menu, X } from "lucide-react";
import MainLayout from "./MainLayout";
import { useState } from "react";
import RoleSwitcher from "@/components/Roleswitcher";

import { musicianNav, bookerNav } from "@/lib/navItems";

type Props = {
  children: React.ReactNode;
  role: "MUSICIAN" | "BOOKER";
};

export default function DashboardLayout({ children, role }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { openUserProfile } = useClerk();

  const navItems = role === "MUSICIAN" ? musicianNav : bookerNav;

  return (
    <MainLayout>
      <div className="flex bg-gray-50 min-h-screen">
        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-0 z-40 lg:hidden transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative w-64 h-full bg-white border-r shadow-sm flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 border-b">
              <h1 className="text-xl text-blue-600 flex items-center gap-3 font-bold">
                <Music className="w-5 h-5" />
                {role === "MUSICIAN" ? "Musician" : "Booker"}
              </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                      isActive && "bg-blue-100 text-blue-700 font-semibold"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 space-y-2 border-t">
              <RoleSwitcher currentRole={role} />
              <div
                className="flex items-center justify-between w-full cursor-pointer px-2 py-2 rounded-lg hover:bg-blue-50"
                onClick={() => openUserProfile()}
              >
                <span className="text-sm text-gray-700">Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r shadow-sm">
          <div className="p-6 border-b">
            <h1 className="text-xl text-blue-600 flex items-center gap-3 font-bold">
              <Music className="w-5 h-5" />
              {role === "MUSICIAN" ? "Musician" : "Booker"}
            </h1>
          </div>

          <nav className="p-4 space-y-2 overflow-y-auto">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    isActive && "bg-blue-100 text-blue-700 font-semibold"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 space-y-2 border-t">
            <RoleSwitcher currentRole={role} />
            <div
              className="flex items-center justify-between w-full cursor-pointer px-2 py-2 rounded-lg hover:bg-blue-50"
              onClick={() => openUserProfile()}
            >
              <span className="text-sm text-gray-700">Account</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <UserButton />
          </div>

          {children}
        </main>
      </div>
    </MainLayout>
  );
}
