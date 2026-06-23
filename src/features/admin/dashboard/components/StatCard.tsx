"use client";

import { cn } from "@/shared/utils/cn";
import type { LucideIcon } from "lucide-react";

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  total: number;
  unit?: string;
  segments: Segment[];
  accentClassName?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  title,
  total,
  unit = "개",
  segments,
  accentClassName = "bg-primary/10 text-primary",
  className,
}: StatCardProps) {
  const sum = segments.reduce((acc, s) => acc + s.value, 0) || 1;

  console.log(accentClassName);

  return (
    <div
      className={cn(
        "group border-border bg-card relative space-y-4 overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              accentClassName,
            )}
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            {title}
          </span>
        </div>
        <span className="text-muted-oreground flex gap-1 text-sm font-medium tabular-nums">
          <span>총</span>
          <span>
            <span className="text-blue-400">{total.toLocaleString()}</span>
            <span>{unit}</span>
          </span>
        </span>
      </div>

      {/* Primary metrics: the two segment values are the heroes */}
      <div className="mt-5 flex flex-row items-center gap-3">
        {segments.map((seg) => {
          const pct = Math.round((seg.value / sum) * 100);
          return (
            <div
              key={seg.label}
              className={"bg-muted/40 flex-1 rounded-xl px-4 py-3.5"}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: seg.color,
                    minWidth: "8px", // 👈 브라우저에게 "너비 0으로 줄일 생각 마라"고 강제 명령
                    minHeight: "8px",
                  }}
                />
                <span className="text-muted-foreground text-xs font-medium whitespace-nowrap">
                  {seg.label}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                <span
                  className="text-foreground text-3xl font-bold tracking-tight tabular-nums"
                  style={{ color: seg.color }}
                >
                  {seg.value.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-xs font-medium tabular-nums">
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Distribution bar */}
      <div className="bg-muted mt-4 flex h-2 w-full overflow-hidden rounded-full">
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{
              width: `${(seg.value / sum) * 100}%`,
              backgroundColor: seg.color,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>
    </div>
  );
}
