import { SiteModel } from "../features/rss/site/model/Site";
import { SiteStatsModel } from "../features/rss/site/model/SiteStats";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("DB 연결 성공");

  // 1. 실제 데이터 조회
  const allSites = await SiteModel.find().lean();
  console.log("현재 DB 사이트 개수:", allSites.length);

  console.log("샘플 데이터:", allSites[0]);

  // 2. 상태별 집계
  const total = allSites.length;

  const rss = allSites.filter((site) => site.feedStatus === "rss").length;
  const crawlable = allSites.filter(
    (site) => site.feedStatus === "crawlable",
  ).length;
  const unavailable = allSites.filter(
    (site) => site.feedStatus === "unavailable",
  ).length;

  console.log(
    `계산값 -> total: ${total}, rss: ${rss}, crawlable: ${crawlable}, unavailable: ${unavailable}`,
  );

  // 3. 통계 저장
  const updateResult = await SiteStatsModel.updateOne(
    { key: "site_stats_main" },
    {
      $set: {
        key: "site_stats_main",
        total,
        rss,
        crawlable,
        unavailable,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  console.log("삽입/업데이트 결과:", updateResult);

  // 4. 확인
  const finalData = await SiteStatsModel.findOne({
    key: "site_stats_main",
  });

  console.log("최종 데이터:", finalData);

  process.exit(0);
}

debug();
