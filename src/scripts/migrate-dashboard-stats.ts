import { AdminDashboardStatsModel } from "@/features/admin/dashboard/model/AdminDashboardStats";
import { FEED_STATS_KEY } from "@/features/admin/feeds/constants/stats";
import { FEED_EXECUTION_LOG_STATS_KEY } from "@/features/admin/logs/constants/stats";
import { SITE_STATS_KEY } from "@/features/admin/sites/constants/stats";
import { FeedExecutionLogStatsModel } from "@/features/feed-execution-logs/model/FeedExecutionLogStat";
import { FeedStatsModel } from "@/features/feeds/model/FeedStats";
import { SiteStatsModel } from "@/features/rss/site/model/SiteStats";
import { REQUEST_TYPE } from "@/features/support/requests/constants/request-type";
import { RequestModel } from "@/features/support/requests/model/Request";

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  console.log("⏳ MongoDB 연결 중...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB 연결 성공");

  console.log("📊 데이터 집계 시작...");

  // 1. 기존 도메인 통계 조회
  const siteStats = await SiteStatsModel.findOne({ key: SITE_STATS_KEY });
  const siteTotal = siteStats?.total ?? 0;
  const siteCanRss = siteStats?.canRss ?? 0;
  const siteNoRss = siteStats?.noRss ?? siteTotal - siteCanRss;

  const feedStats = await FeedStatsModel.findOne({ key: FEED_STATS_KEY });
  const feedTotal = feedStats?.total ?? 0;
  const feedActive = feedStats?.active ?? 0;
  const feedInactive = feedStats?.inactive ?? feedTotal - feedActive;

  const logStats = await FeedExecutionLogStatsModel.findOne({
    key: FEED_EXECUTION_LOG_STATS_KEY,
  });
  const logTotal = logStats?.total ?? 0;
  const logFails = logStats?.fails ?? 0;

  // 2. Request(CS) 통계 집계
  const csStats = await RequestModel.aggregate([
    {
      $group: {
        _id: { type: "$type", status: "$status" },
        count: { $sum: 1 },
      },
    },
  ]);

  const bugReports = {
    total: 0,
    completed: 0,
    pending: 0,
    checking: 0,
    fixing: 0,
  };
  const inquiries = { total: 0, pending: 0, processing: 0, completed: 0 };

  csStats.forEach(({ _id, count }) => {
    const { type, status } = _id;
    const c = count || 0;

    if (type === REQUEST_TYPE.BUG_REPORT) {
      bugReports.total += c;
      if (status === "COMPLETED") bugReports.completed += c;
      else if (status === "PENDING") bugReports.pending += c;
      else if (status === "CHECKING") bugReports.checking += c;
      else if (status === "FIXING") bugReports.fixing += c;
    } else if (type === REQUEST_TYPE.INQUIRY) {
      inquiries.total += c;
      if (status === "PENDING") inquiries.pending += c;
      else if (status === "PROCESSING") inquiries.processing += c;
      else if (status === "COMPLETED") inquiries.completed += c;
    }
  });

  console.log("📈 집계 완료. 데이터 요약:");
  console.log({ bugReports, inquiries });

  // 3. 통합 오버뷰 업데이트
  console.log("💾 dashboard_overview 도큐먼트 갱신 중...");
  await AdminDashboardStatsModel.updateOne(
    { key: "dashboard_overview" },
    {
      $set: {
        key: "dashboard_overview",
        sites: { total: siteTotal, canRss: siteCanRss, noRss: siteNoRss },
        feeds: { total: feedTotal, active: feedActive, inactive: feedInactive },
        feedExecutionLogs: { total: logTotal, fails: logFails },
        bugReports: bugReports,
        inquiries: inquiries,
      },
    },
    { upsert: true },
  );

  console.log("🎉 통합 마이그레이션이 성공적으로 완료되었습니다!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ 마이그레이션 실패:", err);
  process.exit(1);
});
