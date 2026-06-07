/**
 * RSS ingestion test script
 *
 * === 역할 ===
 * RSS feed 1개를 대상으로
 * "외부 데이터 → 내부 DB"로 들어오는 전체 파이프라인을 검증하는 스크립트
 *
 * === 구조 ===
 * fetch → parse → normalize → upsert(sync)
 *
 * === 특징 ===
 * - 단일 feed 기준 (multi-feed 아님)
 * - cron 없음
 * - queue 없음
 * - idempotent ingestion (dedup 적용)
 *
 * === 목적 ===
 * RSS feed 데이터를 DB와 동기화하는
 * 최소 ingestion pipeline 검증
 */

import { FeedModel } from "../features/feeds/model/feed";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";

/**
 * 환경 변수 로딩
 *
 * Next.js 외부 실행 환경이므로
 * .env.local을 직접 로드해야 함
 */
dotenv.config({ path: ".env.local" });

/**
 * MAIN EXECUTION FLOW
 *
 * === 전체 흐름 ===
 * 1. MongoDB 연결
 * 2. Feed 확보 (없으면 생성)
 * 3. RSS fetch
 * 4. XML parse → normalize
 * 5. DB upsert (idempotent sync)
 *
 * === 목적 ===
 * RSS ingestion pipeline end-to-end 검증
 * (재실행해도 결과가 동일해야 함)
 */
async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const feedUrl = "https://hnrss.org/frontpage";

  /**
   * Feed entity 확보
   * 실제 시스템에서는 Site → Feed 생성 flow 존재
   */
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
   * STEP 1: Fetch
   * 외부 RSS → XML 획득
   */
  const xml = await fetchRSS(feedUrl);
  console.log("Fetched XML length:", xml.length);

  /**
   * STEP 2: Parse
   * XML → normalized object
   */
  const items = parseRSS(xml);
  console.log("Parsed items:", items.length);

  /**
   * STEP 3: Upsert
   * MongoDB와 RSS 데이터를 동기화 (idempotent)
   */
  await upsertFeedItems(feed._id.toString(), items);

  console.log("DONE");

  process.exit(0);
}

/**
 * 실행 + 에러 핸들링
 */
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
