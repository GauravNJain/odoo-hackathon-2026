"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <div className="mb-4 text-ink-tertiary">{icon}</div>}
      <h3 className="font-sans text-lg font-semibold text-ink-primary">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-secondary">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4 bg-brand-500 hover:bg-brand-600 text-white">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
