"use client";

import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import type { AdminStats } from "@/types/api.types";

const COLORS = ["#EE5A1F", "#2D9966", "#2B7EC1"];

export default function AdminCharts({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Trips over time */}
      <div className="md:col-span-2 lg:col-span-2 rounded-lg border border-border-default bg-surface p-5 shadow-card">
        <h3 className="font-sans text-base font-semibold text-ink-primary mb-4">Trips Created (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={stats.tripsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DE" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#EE5A1F" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trips by status pie */}
      <div className="rounded-lg border border-border-default bg-surface p-5 shadow-card">
        <h3 className="font-sans text-base font-semibold text-ink-primary mb-4">Trips by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={stats.tripsByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="status" paddingAngle={3}>
              {stats.tripsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top cities bar */}
      <div className="md:col-span-2 lg:col-span-3 rounded-lg border border-border-default bg-surface p-5 shadow-card">
        <h3 className="font-sans text-base font-semibold text-ink-primary mb-4">Top 5 Cities</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.topCities} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DE" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="city" tick={{ fontSize: 12 }} width={80} />
            <Tooltip />
            <Bar dataKey="count" fill="#EE5A1F" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
