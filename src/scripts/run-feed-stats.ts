import { FeedStatsModel } from "../features/feeds/model/FeedStats";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { FeedDto } from "@/features/feeds/dto/feedDto";
import { FeedModel } from "@/features/feeds/model/feed";
import { FEED_STATUS } from "@/features/feeds/constants/feed-status";

dotenv.config({ path: ".env.local" });

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("DB 연결 성공");

  // 1. 실제 데이터 개수 확인
  const count = await FeedModel.countDocuments();
  console.log("현재 DB에 저장된 Feed 개수:", count);

  const allFeeds = await FeedModel.find().lean();
  console.log("조회된 첫 번째 Feed:", allFeeds[0]);

  // 2. 통계 계산
  const total = allFeeds.length;
  const active = allFeeds.filter(
    (feed: FeedDto) => feed.status === FEED_STATUS.ACTIVE,
  ).length;
  const inactive = total - active;

  console.log(
    `계산값 -> total: ${total}, active: ${active}, inactive: ${inactive}`,
  );

  // 3. 강제 삽입
  const updateResult = await FeedStatsModel.updateOne(
    { key: "feed_stats_main" },
    {
      $set: {
        key: "feed_stats_main",
        total,
        active,
        inactive,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  console.log("삽입/업데이트 결과:", updateResult);

  // 4. 최종 확인
  const finalData = await FeedStatsModel.findOne({
    key: "feed_stats_main",
  });

  console.log("DB에 저장된 최종 데이터:", finalData);

  process.exit(0);
}

debug();
