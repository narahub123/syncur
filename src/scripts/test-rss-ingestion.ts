/**
 * RSS ingestion test script (light validator)
 *
 * === 역할 ===
 * RSS ingestion pipeline의 핵심 흐름 검증
 *
 * fetchRSS (cache + retry 포함)
 * → parseRSS
 * → upsertFeedItems
 *
 * === 목적 ===
 * - RSS pipeline 정상 동작 확인
 * - cache / retry / parse 안정성 검증
 */

import { FeedModel } from "../features/feeds/model/feed";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";

dotenv.config({ path: ".env.local" });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const feedUrl = "https://hnrss.org/frontpage";

  let feed = await FeedModel.findOne({ feedUrl });

  if (!feed) {
    feed = await FeedModel.create({
      siteId: new mongoose.Types.ObjectId(),
      feedUrl,
      status: "active",
      errorCount: 0,
      categories: ["tech"],
    });

    console.log("Created feed:", feed._id);
  }

  /**
   * STEP 1: Fetch (NEW STRUCTURE)
   * - cache / retry 포함된 결과 반환
   */
  const result = await fetchRSS(feed);

  if (result.type === "NOT_MODIFIED") {
    console.log("[TEST] SKIPPED - NOT_MODIFIED");
    process.exit(0);
  }

  const xml = result.xml;

  if (!xml) {
    throw new Error("XML missing from fetch result");
  }

  console.log("Fetched XML length:", xml.length);

  /**
   * STEP 2: Parse
   */
  const items = parseRSS(xml);
  console.log("Parsed items:", items.length);

  /**
   * STEP 3: Upsert
   */
  await upsertFeedItems(feed._id.toString(), items);

  console.log("DONE");

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
