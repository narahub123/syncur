import { StatCard } from "@/shared/components/common/StatCard";
import { MessageSquare, Bug, CheckCircle2 } from "lucide-react";

export const CsSection = () => {
  const stats = [
    {
      title: "문의 사항 (계류)",
      value: <span className="text-blue-600">5 건</span>,
      icon: MessageSquare,
      desc: "처리 대기 중인 일반 문의",
    },
    {
      title: "버그 신고 (계류)",
      value: <span className="text-red-600">2 건</span>,
      icon: Bug,
      desc: "즉시 수정이 필요한 버그",
      className: "border-red-200 bg-red-50/50",
    },
    {
      title: "전체 처리율",
      value: "92%",
      icon: CheckCircle2,
      desc: "문의 및 버그 대응 완료율",
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">고객 지원 (CS)</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};
