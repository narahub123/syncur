"use client";

import { MessageSquare, Bug, CheckCircle2 } from "lucide-react";
import { BugReportStatsDTO } from "@/features/support/bug-reports/dto/bugReportStatsDTO";
import { InquiryStatsDTO } from "@/features/support/inquiries/dto/inquiryStatDTO";
import { StatCard } from "./StatCard";
import { StatCardSkeleton } from "./StatCardSkeleton";

interface CsSectionProps {
  cs: {
    bugReports: BugReportStatsDTO;
    inquiries: InquiryStatsDTO;
  };
  isLoading: boolean;
}

export const CsSection = ({ cs, isLoading }: CsSectionProps) => {
  const { bugReports, inquiries } = cs;

  // 1. 상태 감지 (DTO 필드 기준 - total 제외 항목들)
  const isBugAlert =
    bugReports.pending + bugReports.checking + bugReports.fixing > 0;
  const isInquiryAlert = inquiries.pending + inquiries.processing > 0;

  // 2. 전체 처리율 계산 (DTO의 total 값을 그대로 사용)
  const totalRequests = bugReports.total + inquiries.total;
  const completedRequests = bugReports.completed + inquiries.completed;
  // const completionRate =
  //   totalRequests > 0
  //     ? Math.round((completedRequests / totalRequests) * 100)
  //     : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold">🎧 고객 지원 (CS) 현황</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }

  if (!cs) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        🎧 고객 지원 (CS) 현황
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {/* ✅ 전체 처리율 카드 */}
        <StatCard
          icon={CheckCircle2}
          title="전체 대응 처리율"
          total={totalRequests}
          unit="건"
          accentClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
          segments={[
            { label: "대응 완료", value: completedRequests, color: "#6366f1" },
            {
              label: "대기",
              value: totalRequests - completedRequests,
              color:
                totalRequests - completedRequests > 0 ? "#f43f5e" : "#94a3b8",
            },
          ]}
        />
        {/* 🐞 버그 신고 카드 (BugReportStatsDTO 1:1 매핑) */}
        <StatCard
          icon={Bug}
          title="버그 신고"
          total={bugReports.total}
          unit="건"
          accentClassName={
            isBugAlert
              ? "bg-rose-100 text-rose-600"
              : "bg-emerald-100 text-emerald-600"
          }
          className={isBugAlert ? "border-rose-300 bg-rose-50/5" : ""}
          segments={[
            { label: "완료", value: bugReports.completed, color: "#10b981" },
            {
              label: "대기",
              value: bugReports.pending,
              color: bugReports.pending > 0 ? "#f43f5e" : "#94a3b8",
            },
            {
              label: "확인중",
              value: bugReports.checking,
              color: bugReports.checking > 0 ? "#f97316" : "#94a3b8",
            },
            {
              label: "수정중",
              value: bugReports.fixing,
              color: bugReports.fixing > 0 ? "#eab308" : "#94a3b8",
            },
          ]}
        />

        {/* 💬 문의 사항 카드 (InquiryStatsDTO 1:1 매핑) */}
        <StatCard
          icon={MessageSquare}
          title="문의 사항"
          total={inquiries.total}
          unit="건"
          accentClassName={
            isInquiryAlert
              ? "bg-amber-100 text-amber-600"
              : "bg-blue-100 text-blue-600"
          }
          className={isInquiryAlert ? "border-amber-300/70 bg-amber-50/5" : ""}
          segments={[
            { label: "완료", value: inquiries.completed, color: "#3b82f6" },
            {
              label: "대기",
              value: inquiries.pending,
              color: inquiries.pending > 0 ? "#f59e0b" : "#94a3b8",
            },
            {
              label: "처리중",
              value: inquiries.processing,
              color: inquiries.processing > 0 ? "#f59e0b" : "#94a3b8",
            },
          ]}
        />
      </div>
    </div>
  );
};
