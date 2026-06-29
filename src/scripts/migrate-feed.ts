import mongoose from "mongoose";
import dotenv from "dotenv";
import { FeedModel } from "@/features/feeds/model/feed";

dotenv.config({
  path: ".env.local",
});

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB...");

  try {
    /**
     * 기존 RSS Feed를 새로운 스키마로 마이그레이션
     *
     * 추가 대상
     * - uniqueKey
     * - sourceType
     * - name
     * - listingPageUrl
     * - listingPageConfig
     * - detailPageConfig
     * - crawlerState
     *
     * 이미 존재하는 필드는 수정하지 않는다.
     */
    const feeds = await FeedModel.find({
      sourceType: { $exists: false },
    }).lean();

    for (const feed of feeds) {
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: {
            uniqueKey: `rss:${feed.feedUrl}`,
            sourceType: "rss",
            name: "",
            listingPageUrl: null,
            listingPageConfig: null,
            detailPageConfig: null,
            crawlerState: {
              lastSeenUrl: null,
              lastCrawledAt: null,
            },
          },
        },
      );
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
