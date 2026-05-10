"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border-default bg-surface/80 px-4 backdrop-blur-md shadow-nav md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <span className="font-display text-xl font-bold text-ink-primary">
            Traveloop
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/search">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5 text-ink-secondary" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5 text-ink-secondary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-brand-100 text-brand-700 font-medium text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-ink-primary">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-ink-secondary">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = "/profile"} className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-2 text-error cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
