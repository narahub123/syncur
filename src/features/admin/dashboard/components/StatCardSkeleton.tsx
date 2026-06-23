"use client";

export function StatCardSkeleton() {
  return (
    <div className="group border-border bg-card relative w-full rounded-2xl border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Metrics Area: StatCard와 동일한 flex 구조 */}
      <div className="mt-5 flex w-full flex-row items-center gap-3">
        {/* 가변적인 너비를 위해 flex-1 사용 */}
        <div className="flex-1 rounded-xl bg-zinc-100 px-4 py-3.5 dark:bg-zinc-900">
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-300 dark:bg-zinc-700" />
          <div className="mt-2 h-8 w-20 animate-pulse rounded bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="flex-1 rounded-xl bg-zinc-100 px-4 py-3.5 dark:bg-zinc-900">
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-300 dark:bg-zinc-700" />
          <div className="mt-2 h-8 w-20 animate-pulse rounded bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>

      {/* Distribution Bar */}
      <div className="mt-4 h-2 w-full animate-pulse overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
