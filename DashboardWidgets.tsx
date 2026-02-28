import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatusStep {
  label: string;
  completed: boolean;
  active: boolean;
}

export function StatusTracker({ steps }: { steps: StatusStep[] }) {
  return (
    <div className="flex items-center gap-1 w-full overflow-x-auto pb-2">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              step.completed ? "gradient-hero text-primary-foreground shadow-glow" :
              step.active ? "border-2 border-primary text-primary animate-pulse-soft" :
              "border-2 border-border text-muted-foreground"
            )}>
              {step.completed ? "✓" : i + 1}
            </div>
            <span className={cn(
              "text-[10px] text-center leading-tight max-w-[70px]",
              step.completed || step.active ? "text-foreground font-medium" : "text-muted-foreground"
            )}>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "h-0.5 flex-1 mx-1 rounded-full min-w-[16px]",
              step.completed ? "gradient-hero" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

export function StatCard({ label, value, icon, trend }: { label: string; value: string | number; icon: ReactNode; trend?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && <p className="text-xs text-success mt-1">{trend}</p>}
        </div>
        <div className="h-10 w-10 rounded-lg gradient-hero-soft flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
      priority === "high" ? "bg-destructive/10 text-destructive" :
      priority === "medium" ? "bg-warning/10 text-warning" :
      "bg-success/10 text-success"
    )}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    submitted: "bg-info/10 text-info",
    accepted: "bg-primary/10 text-primary",
    assigned: "bg-warning/10 text-warning",
    "in progress": "bg-accent/10 text-accent",
    resolved: "bg-success/10 text-success",
    rejected: "bg-destructive/10 text-destructive",
    pending: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold", colors[status.toLowerCase()] || colors.pending)}>
      {status}
    </span>
  );
}
