import { Skeleton } from "@/shared/components/ui/skeleton";

export function FeedItemSkeleton() {
  return (
    <article className="border-b px-6 py-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-sm" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        <Skeleton className="h-6 w-6 rounded-md" />
      </div>

      {/* Title */}
      <div className="mt-6 space-y-2">
        <Skeleton className="h-7 w-3/4" />
      </div>

      {/* Description */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>

      {/* Action Bar */}
      <div className="mt-6 flex justify-around">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}
