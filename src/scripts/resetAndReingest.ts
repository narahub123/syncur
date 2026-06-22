import mongoose from "mongoose";
import dotenv from "dotenv";
import { FeedModel } from "@/features/feeds/model/feed";
import { FeedItemModel } from "@/features/feed-items/models/feed-item";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";
import { feedFetchObservationService } from "@/features/feed-fetch-observation/services/FeedFetchObservationService.instance";
import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";

dotenv.config({ path: ".env.local" });

async function resetAndReingest() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  console.log("DB connected");

  /**
   * 1. 기존 데이터 전체 삭제
   * - FeedItem만 초기화 (Feed는 유지해도 되고 같이 지워도 됨)
   */
  await FeedItemModel.deleteMany({});
  console.log("FeedItems cleared");

  /**
   * 2. Feed 목록 가져오기
   */
  const feeds = await FeedModel.find({});
  console.log(`Feeds found: ${feeds.length}`);

  /**
   * 3. 전체 재수집
   */
  for (const feed of feeds) {
    try {
      console.log(`\n====================================`);
      console.log(`FEED: ${feed.feedUrl}`);
      console.log(`====================================`);

      const execution = await feedExecutionLogService.startExecution(feed._id);
      const executionId = execution.executionId;

      const result = await fetchRSS(feed, executionId, (log) =>
        feedFetchObservationService.record(log),
      );

      if (result.type === "NOT_MODIFIED") {
        console.log("SKIPPED: NOT_MODIFIED");
        continue;
      }

      if (!result.xml) {
        console.log("SKIPPED: NO XML");
        continue;
      }

      const items = parseRSS(result.xml);

      console.log(`Parsed items: ${items.length}`);

      await upsertFeedItems(feed._id.toString(), items);

      console.log("DONE");
    } catch (err) {
      console.error("FAILED FEED:", feed.feedUrl);
      console.error(err);
    }
  }

  console.log("\nALL DONE");

  process.exit(0);
}

resetAndReingest().catch((err) => {
  console.error(err);
  process.exit(1);
});
