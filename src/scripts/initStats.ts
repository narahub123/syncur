import { SiteModel } from "../features/rss/site/model/Site";
import { SiteStatsModel } from "../features/rss/site/model/SiteStats";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { SiteDto } from "@/features/rss/site/dto/siteDto";

dotenv.config({ path: ".env.local" });

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("DB 연결 성공");

  // 1. 실제 데이터 개수 확인
  const count = await SiteModel.countDocuments();
  console.log("현재 DB에 저장된 사이트 개수:", count);

  const allSites = await SiteModel.find().lean();
  console.log("조회된 첫 번째 사이트:", allSites[0]);

  // 2. 통계 계산
  const total = allSites.length;
  const canRss = allSites.filter((site: SiteDto) => site.feed_url).length;
  const noRss = total - canRss;

  console.log(`계산값 -> total: ${total}, canRss: ${canRss}, noRss: ${noRss}`);

  // 3. 강제 삽입 (기존 데이터가 있든 없든)
  const updateResult = await SiteStatsModel.updateOne(
    { key: "site_stats_main" }, // 여기를 _id 대신 key로 변경
    {
      $set: {
        key: "site_stats_main", // 생성 시에도 key 포함
        total,
        canRss,
        noRss,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  console.log("삽입/업데이트 결과:", updateResult);

  // 4. 최종 확인
  const finalData = await SiteStatsModel.findOne({ key: "site_stats_main" });
  console.log("DB에 저장된 최종 데이터:", finalData);

  process.exit(0);
}

debug();
