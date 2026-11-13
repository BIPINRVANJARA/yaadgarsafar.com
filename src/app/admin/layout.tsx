"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandWordmark } from "@/components/navigation/BrandWordmark";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Inbox,
  Camera,
  Star,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "@/lib/firebase/authService";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("admin@yaadgarsafar.com");

  // Check admin authentication session state with Firebase Auth
  useEffect(() => {
    // If on login page, do not require auth check
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    // Subscribe to Firebase Auth state
    const unsubscribe = authService.onAuthChange((user) => {
      const localAuthStr = localStorage.getItem("yaadgar_admin_auth");
      if (user) {
        setIsAuthenticated(true);
        if (user.email) setAdminEmail(user.email);
      } else if (localAuthStr) {
        try {
          const parsed = JSON.parse(localAuthStr);
          setIsAuthenticated(true);
          if (parsed.email) setAdminEmail(parsed.email);
        } catch {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [pathname, router]);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Enquiries", href: "/admin/enquiries", icon: Inbox },
    { label: "Finances", href: "/admin/finances", icon: WalletCards },
    { label: "Tour Packages", href: "/admin/packages", icon: Package },
    { label: "Destinations", href: "/admin/destinations", icon: MapPin },
    { label: "Photo Gallery", href: "/admin/gallery", icon: Camera },
    { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
    { label: "Website Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await authService.logoutAdmin();
    } catch (e) {
      console.warn("Firebase logout notice:", e);
    }
    localStorage.removeItem("yaadgar_admin_auth");
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-brand-offWhite">{children}</div>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-offWhite">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-brand-darkNavy text-white p-4 flex items-center justify-between z-30 sticky top-0">
        <BrandWordmark theme="dark" size="sm" href="/admin/dashboard" />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1 rounded-lg text-white hover:bg-white/10"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-brand-darkNavy text-white flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen shrink-0 overflow-y-auto shadow-xl md:shadow-none",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="pb-6 border-b border-white/10">
            <BrandWordmark theme="dark" size="md" href="/admin/dashboard" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-red bg-brand-red/20 px-2 py-0.5 rounded mt-2 inline-block">
              Admin Workspace
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                    isActive
                      ? "bg-brand-red text-white shadow-md shadow-brand-red/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-brand-red/30 text-brand-red flex items-center justify-center font-bold text-xs uppercase">
              {adminEmail.slice(0, 2)}
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-bold text-white leading-none truncate">{adminEmail}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/50">Firebase Verified</span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
