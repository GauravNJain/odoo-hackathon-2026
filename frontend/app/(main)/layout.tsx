"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar, MobileBottomNav } from "@/components/shared/Sidebar";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 overflow-y-auto bg-canvas pb-20 md:pb-0">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </ProtectedRoute>
  );
}
