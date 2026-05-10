"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { CategoryBreakdown } from "@/types/budget.types";

interface BudgetChartProps {
  breakdown: CategoryBreakdown[];
  avgPerDay: number;
}

const categoryLabels: Record<string, string> = {
  transport: "Transport",
  stay: "Accommodation",
  food: "Food & Dining",
  activities: "Activities",
  shopping: "Shopping",
  other: "Other",
};

export default function BudgetChart({ breakdown, avgPerDay }: BudgetChartProps) {
  const data = breakdown.map((b) => ({
    name: categoryLabels[b.category] ?? b.category,
    value: b.amount,
    color: b.color,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Pie chart */}
      <div className="rounded-lg border border-border-default bg-surface p-5 shadow-card">
        <h3 className="font-sans text-base font-semibold text-ink-primary mb-4">Spend by Category</h3>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink-tertiary text-center py-12">No data</p>
        )}
      </div>

      {/* Breakdown table */}
      <div className="rounded-lg border border-border-default bg-surface p-5 shadow-card">
        <h3 className="font-sans text-base font-semibold text-ink-primary mb-4">Cost Breakdown</h3>
        <div className="space-y-3">
          {breakdown.map((b) => (
            <div key={b.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
                <span className="text-sm text-ink-primary">{categoryLabels[b.category] ?? b.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-ink-primary">₹{b.amount.toLocaleString("en-IN")}</span>
                <span className="ml-2 text-xs text-ink-tertiary">{b.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border-default flex justify-between">
          <span className="text-sm text-ink-secondary">Avg. cost/day</span>
          <span className="text-sm font-semibold text-ink-primary">₹{avgPerDay.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
