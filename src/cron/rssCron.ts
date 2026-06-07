import cron from "node-cron";
import mongoose from "mongoose";
import { FeedModel } from "@/features/feeds/model/feed";
import { runFeedIngestion } from "@/ingestion/rss/runFeedIngestion";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

/**
 * RSS Cron Entry
 *
 * - 10분마다 실행
 * - active feed만 처리
 * - ingestion pipeline 호출만 담당
 */
async function runCron() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  cron.schedule("*/10 * * * *", async () => {
    console.log("[RSS CRON] start");

    try {
      /**
       * 1. 대상 feed 조회
       */
      const feeds = await FeedModel.find({
        status: "active",
      }).sort({ lastFetchedAt: 1 });

      console.log(`[RSS CRON] feeds: ${feeds.length}`);

      /**
       * 2. 순차 실행 (MVP 기준)
       * - 동시성 X (안정성 우선)
       */
      for (const feed of feeds) {
        try {
          await runFeedIngestion(feed);
        } catch (err) {
          console.error("[FEED INGEST ERROR]", feed.feedUrl, err);
        }
      }

      console.log("[RSS CRON] done");
    } catch (err) {
      console.error("[CRON ERROR]", err);
    }
  });
}

/**
 * 실행
 */
runCron().catch((err) => {
  console.error("[CRON BOOT ERROR]", err);
  process.exit(1);
});
