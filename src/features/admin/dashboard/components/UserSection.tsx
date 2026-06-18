import { StatCard } from "@/shared/components/common/StatCard";
import { Users, UserPlus } from "lucide-react";

export const UserSection = () => {
  // 실제 환경에서는 API 호출로 데이터를 가져옵니다.
  const stats = [
    {
      title: "총 가입자",
      value: "1,240",
      icon: Users,
      desc: "서비스 누적 회원 수",
    },
    {
      title: "오늘의 신규 가입",
      value: "12",
      icon: UserPlus,
      desc: "오늘 가입한 신규 회원",
      className: "text-blue-600",
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">사용자 현황</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};
