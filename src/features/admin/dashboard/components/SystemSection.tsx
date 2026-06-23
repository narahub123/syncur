"use client";

import { Cpu, Globe, Rss } from "lucide-react";
import { SystemSectionData } from "../types/stats";
import { StatCard } from "./StatCard"; // 🎯 StatCard가 위치한 실제 경로로 맞춰주세요.

export const SystemSection = ({ system }: { system: SystemSectionData }) => {
  const { sites, feeds, feedExecutionLogs } = system;

  // 1. 수집 엔진 로그 데이터 가공
  const { total: logTotal, fails: logFails } = feedExecutionLogs;
  const successCount = logTotal - logFails;
  const successRate =
    logTotal > 0 ? Math.round((successCount / logTotal) * 100) : 100;
  const hasFails = logFails > 0;

  // 2. 부정적 상태 감지 변수 (1개 이상 문제가 생기면 true)
  const isSiteAlert = sites.noRss > 0;
  const isFeedAlert = feeds.inactive > 0;
  const isEngineAlert = hasFails || (logTotal > 0 && successRate < 90);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        🖥️ 시스템 리소스 현황
      </h2>

      {/* 3열 가로 균형 배치 그리드 */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* 🌍 1. 사이트 카드 */}
        <StatCard
          icon={Globe}
          title="전체 등록 사이트"
          total={sites.total}
          unit="개"
          accentClassName={
            isSiteAlert
              ? "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          }
          /* 🎯 문제가 발생하면 카드 전체에 테두리 경`고선 가미 */
          className={
            isSiteAlert
              ? "border-rose-300 bg-rose-50/5 dark:border-rose-900/40"
              : ""
          }
          segments={[
            {
              label: "RSS 가능",
              value: sites.canRss,
              color: "#10b981", // emerald-500
            },
            {
              label: "RSS 불가",
              value: sites.noRss,
              /* 🎯 평소엔 차분한 슬레이트 색, 불가 사이트 생기면 경고 레드로 변경 */
              color: isSiteAlert ? "#f43f5e" : "#94a3b8",
            },
          ]}
        />

        {/* 🛜 2. 피드 카드 */}
        <StatCard
          icon={Rss}
          title="수집된 전체 피드"
          total={feeds.total}
          unit="개"
          accentClassName={
            isFeedAlert
              ? "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
          }
          /* 🎯 비활성 피드가 있으면 테두리 변화 */
          className={
            isFeedAlert
              ? "border-amber-300/70 bg-amber-50/5 dark:border-amber-900/20"
              : ""
          }
          segments={[
            {
              label: "활성 피드",
              value: feeds.active,
              color: "#3b82f6", // blue-500
            },
            {
              label: "비활성 피드",
              value: feeds.inactive,
              color: isFeedAlert ? "#f59e0b" : "#94a3b8", // amber-500 : slate-400
            },
          ]}
        />

        {/* ⚙️ 3. 수집 엔진 로그 카드 (StatCard 규격으로 일치화) */}
        <StatCard
          icon={Cpu}
          title="피드 수집 엔진 상태"
          total={logTotal}
          unit="회 실행"
          accentClassName={
            isEngineAlert
              ? "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          }
          className={
            isEngineAlert
              ? "border-rose-300 bg-rose-50/5 dark:border-rose-900/30"
              : ""
          }
          segments={[
            {
              label: "성공 건수",
              value: successCount,
              color: "#10b981", // emerald-500
            },
            {
              label: "실패 건수",
              value: logFails,
              color: hasFails ? "#f43f5e" : "#94a3b8", // 수집 실패 발생 시 레드 반전
            },
          ]}
        />
      </div>
    </div>
  );
};
