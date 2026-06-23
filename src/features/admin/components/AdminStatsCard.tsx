interface AdminStatsCardProps {
  title: string;
  total: number;
  items: {
    label: string;
    value: number;
    color: string;
  }[];
  progressValue: number; // 0 ~ 100
  isLoading: boolean;
}

export const AdminStatsCard = ({
  title,
  total,
  items,
  progressValue,
  isLoading,
}: AdminStatsCardProps) => {
  if (isLoading) return <AdminStatsCardSkeleton />;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-2xl font-bold">{total}개</span>
      </div>
      <div className="mb-4 h-3 w-full rounded-full bg-gray-100">
        <div
          className="h-3 rounded-full bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        {items.map((item) => (
          <span key={item.label} style={{ color: item.color }}>
            {item.label}: {item.value}
          </span>
        ))}
      </div>
    </div>
  );
};

export function AdminStatsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-1/3 rounded bg-gray-200" />
        <div className="h-8 w-1/4 rounded bg-gray-200" />
      </div>

      {/* Progress Bar Skeleton */}
      <div className="mb-4 h-3 w-full rounded-full bg-gray-100" />

      {/* Items List Skeleton */}
      <div className="flex justify-between gap-4 text-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-1/4 rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
