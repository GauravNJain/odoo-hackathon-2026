"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useAdminStats, useAdminUsers } from "@/hooks/useAdmin";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Map, Activity, Globe } from "lucide-react";

const AdminCharts = dynamic(() => import("@/components/admin/AdminCharts"), { ssr: false });

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: stats, isLoading: sl } = useAdminStats();
  const { data: users, isLoading: ul } = useAdminUsers();

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  if (user?.role !== "admin") return null;
  if (sl || ul) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  const kpis = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-info" },
    { label: "Total Trips", value: stats?.totalTrips ?? 0, icon: Map, color: "text-brand-500" },
    { label: "Active Trips", value: stats?.activeTrips ?? 0, icon: Activity, color: "text-success" },
    { label: "Destinations", value: stats?.popularDestinations?.length ?? 0, icon: Globe, color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" />

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-lg border border-border-default bg-surface p-4 shadow-card">
            <div className="flex items-center gap-2 mb-1"><k.icon className={`h-5 w-5 ${k.color}`} /></div>
            <p className="text-2xl font-bold text-ink-primary">{k.value.toLocaleString()}</p>
            <p className="text-xs text-ink-secondary">{k.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {stats && <AdminCharts stats={stats} />}
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="rounded-lg border border-border-default bg-surface shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border-default bg-canvas text-left text-xs text-ink-tertiary">
                <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Trips</th><th className="p-3">Joined</th><th className="p-3">Status</th>
              </tr></thead>
              <tbody>
                {users?.map(u => (
                  <tr key={u.id} className="border-b border-border-default/50">
                    <td className="p-3 font-medium text-ink-primary">{u.name}</td>
                    <td className="p-3 text-ink-secondary">{u.email}</td>
                    <td className="p-3">{u.tripsCount}</td>
                    <td className="p-3 text-ink-secondary">{u.joinedDate}</td>
                    <td className="p-3"><Badge className={u.status === "active" ? "bg-success/10 text-success border-0" : "bg-error/10 text-error border-0"}>{u.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="trips" className="mt-4">
          <p className="text-sm text-ink-secondary">Trip management table coming soon.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
