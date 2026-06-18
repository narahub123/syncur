import { StatCard } from "@/shared/components/common/StatCard";
import { ROUTES } from "@/shared/constants/routes";
import { AlertTriangle, Database, Rss, Globe } from "lucide-react";
import Link from "next/link";

// 데이터는 추후 API 응답값으로 교체 예정
export const SystemSection = () => {
  const stats = [
    {
      title: "사이트 상태",
      value: (
        <span>
          450 / 420 / <span className="text-red-500">30</span>
        </span>
      ),
      icon: Globe,
      desc: "전체 / RSS 가능 / 불가능",
      href: ROUTES.ADMIN_SITES,
    },
    {
      title: "피드 상태",
      value: (
        <span>
          128 / 110 / <span className="text-red-500">18</span>
        </span>
      ),
      icon: Rss,
      desc: "전체 / 활성 / 비활성",
      href: ROUTES.ADMIN_SITES,
    },
    {
      title: "기사 수집 현황",
      value: "145,230 / 2,450",
      icon: Database,
      desc: "전체 누적 / 오늘 수집",
      href: ROUTES.ADMIN_SITES,
    },
    {
      title: "오류 현황",
      value: <span className="text-red-600">3 건</span>,
      icon: AlertTriangle,
      desc: "오늘 발생한 수집 오류",
      className: "border-red-200 bg-red-50/50", // 카드 강조
      href: ROUTES.ADMIN_SITES,
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">시스템 관제 (Feed)</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <StatCard {...stat} />
          </Link>
        ))}
      </div>
    </section>
  );
};
