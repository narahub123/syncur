import { AdminDashboardStatsModel } from "@/features/admin/dashboard/model/AdminDashboardStats";
import { FEED_STATS_KEY } from "@/features/admin/feeds/constants/stats";
import { FEED_EXECUTION_LOG_STATS_KEY } from "@/features/admin/logs/constants/stats";
import { SITE_STATS_KEY } from "@/features/admin/sites/constants/stats";
import { FeedExecutionLogStatsModel } from "@/features/feed-execution-logs/model/FeedExecutionLogStat";
import { FeedStatsModel } from "@/features/feeds/model/FeedStats";
import { SiteStatsModel } from "@/features/rss/site/model/SiteStats";
import dotenv from "dotenv";
import mongoose from "mongoose";

// 🎯 제공해주신 실제 통계 모델들 임포트 (경로를 프로젝트에 맞게 맞춰주세요)

dotenv.config({
  path: ".env.local",
});

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  console.log("⏳ MongoDB 연결 중...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB 연결 성공");

  console.log("📊 기존 도메인 통계(Stats) 컬렉션에서 데이터 조회 시작...");

  // 1. Site 통계 가져오기
  const siteStats = await SiteStatsModel.findOne({ key: SITE_STATS_KEY });
  const siteTotal = siteStats?.total ?? 0;
  const siteCanRss = siteStats?.canRss ?? 0;
  const siteNoRss = siteStats?.noRss ?? siteTotal - siteCanRss;

  // 2. Feed 통계 가져오기
  const feedStats = await FeedStatsModel.findOne({ key: FEED_STATS_KEY });
  const feedTotal = feedStats?.total ?? 0;
  const feedActive = feedStats?.active ?? 0;
  const feedInactive = feedStats?.inactive ?? feedTotal - feedActive;

  // 3. Feed Execution Log 통계 가져오기
  const logStats = await FeedExecutionLogStatsModel.findOne({
    key: FEED_EXECUTION_LOG_STATS_KEY,
  });
  const logTotal = logStats?.total ?? 0;
  const logFails = logStats?.fails ?? 0;

  console.log(`📈 추출된 Stats 데이터 요약:
  - 사이트: 총 ${siteTotal}개 (가능 ${siteCanRss} / 불가 ${siteNoRss})
  - 피드: 총 ${feedTotal}개 (활성 ${feedActive} / 비활성 ${feedInactive})
  - 로그: 총 ${logTotal}건 (실패 ${logFails}건)
  `);

  // 4. 대시보드 통합 오버뷰 문서에 밀어넣기
  console.log("💾 dashboard_overview 도큐먼트 생성/갱신 중...");
  await AdminDashboardStatsModel.updateOne(
    { key: "dashboard_overview" },
    {
      $set: {
        key: "dashboard_overview",
        sites: {
          total: siteTotal,
          canRss: siteCanRss,
          noRss: siteNoRss,
        },
        feeds: {
          total: feedTotal,
          active: feedActive,
          inactive: feedInactive,
        },
        feedExecutionLogs: {
          total: logTotal,
          fails: logFails,
        },
      },
    },
    { upsert: true },
  );

  console.log("🎉 기존 Stats 기반 통합 마이그레이션이 완료되었습니다!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ 마이그레이션 실패:", err);
  process.exit(1);
});
