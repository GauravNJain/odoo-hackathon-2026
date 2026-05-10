"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Map,
  Search,
  Users,
  UserCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Trips", href: "/trips", icon: Map },
  { label: "Explore", href: "/search", icon: Search },
  { label: "Community", href: "/community", icon: Users },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border-default bg-surface transition-transform duration-200 md:sticky md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="font-display text-lg font-bold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-l-[3px] border-brand-500 bg-brand-500/[0.08] text-brand-500"
                    : "text-ink-secondary hover:bg-surface-hover hover:text-ink-primary",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/admin"
                  ? "border-l-[3px] border-brand-500 bg-brand-500/[0.08] text-brand-500"
                  : "text-ink-secondary hover:bg-surface-hover hover:text-ink-primary",
              )}
            >
              <ShieldCheck className="h-5 w-5 shrink-0" />
              Admin
            </Link>
          )}
        </nav>

        <div className="border-t border-border-default p-4">
          <p className="text-xs text-ink-tertiary">© 2025 Traveloop</p>
        </div>
      </aside>
    </>
  );
}

/* Mobile bottom navigation */
export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Trips", href: "/trips", icon: Map },
    { label: "Explore", href: "/search", icon: Search },
    { label: "Community", href: "/community", icon: Users },
    { label: "Profile", href: "/profile", icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border-default bg-surface py-2 md:hidden">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
              isActive ? "text-brand-500" : "text-ink-tertiary",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
