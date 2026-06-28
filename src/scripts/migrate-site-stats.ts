import mongoose from "mongoose";
import dotenv from "dotenv";

import { SiteModel } from "@/features/rss/site/model/Site";
import { SiteStatsModel } from "@/features/rss/site/model/SiteStats";
import { SITE_STATS_KEY } from "@/features/admin/sites/constants/stats";

dotenv.config({ path: ".env.local" });

async function migrateSiteStats() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  console.log("⏳ MongoDB 연결 중...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB 연결 성공");

  console.log("📊 Site 기준으로 통계 재집계 시작...");

  const sites = await SiteModel.find({}, { feedStatus: 1 }).lean();

  const total = sites.length;

  let rss = 0;
  let crawlable = 0;
  let unavailable = 0;

  for (const site of sites) {
    switch (site.feedStatus) {
      case "rss":
        rss++;
        break;
      case "crawlable":
        crawlable++;
        break;
      case "unavailable":
        unavailable++;
        break;
    }
  }

  console.log("📌 집계 결과:");
  console.log({ total, rss, crawlable, unavailable });

  console.log("💾 SiteStats 업데이트 중...");

  await SiteStatsModel.updateOne(
    { key: SITE_STATS_KEY },
    {
      $set: {
        key: SITE_STATS_KEY,
        total,
        rss,
        crawlable,
        unavailable,
      },
    },
    { upsert: true },
  );

  console.log("🎉 SiteStats 마이그레이션 완료");

  process.exit(0);
}

migrateSiteStats().catch((err) => {
  console.error("❌ 마이그레이션 실패:", err);
  process.exit(1);
});
