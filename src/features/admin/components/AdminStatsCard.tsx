interface AdminStatsCardProps {
  title: string;
  total: number;
  items: {
    label: string;
    value: number;
    color: string;
  }[];
  progressValue: number; // 0 ~ 100
}

export const AdminStatsCard = ({
  title,
  total,
  items,
  progressValue,
}: AdminStatsCardProps) => (
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
