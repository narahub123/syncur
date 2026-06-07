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

import { FeedItemModel } from "../features/feed-items/model/feed-item";
import { FeedModel } from "../features/feeds/model/feed";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

/**
 * 환경 변수 로딩
 *
 * Next.js 외부 실행 환경이므로
 * .env.local을 직접 로드해야 함
 */
dotenv.config({ path: ".env.local" });

/**
 * RSS item 내부 표준 구조
 *
 * === 역할 ===
 * RSS / Atom은 구조가 다르기 때문에
 * DB 저장 전에 "공통 포맷"으로 통일하기 위한 DTO
 *
 * === 포인트 ===
 * - RSS/Atom 필드명이 다름 (guid/id/link 혼재)
 * - optional 필드 많음
 */
type RSSItem = {
  guid?: string | null;
  link: string;
  title: string;
  description?: string | null;
  content?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  categories: string[];
};

/**
 * XML 파서 결과는 구조가 고정되지 않기 때문에
 * 안전하게 접근하기 위한 loose 타입
 *
 * === 이유 ===
 * RSS/Atom XML 구조는 스키마가 존재하지 않는 JSON-like 구조
 */
type XMLNode = Record<string, unknown>;

/**
 * RSS XML fetch layer
 *
 * === 역할 ===
 * RSS URL → raw XML string 획득
 *
 * === 특징 ===
 * - timeout 필수 (외부 서버 hang 방지)
 * - RSS 서버 차단 방지용 User-Agent 설정
 */
async function fetchRSS(feedUrl: string): Promise<string> {
  const res = await axios.get(feedUrl, {
    timeout: 8000,
    headers: {
      "User-Agent": "Syncur RSS Bot",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  return res.data;
}

/**
 * 안전한 string 변환 helper
 *
 * === 이유 ===
 * XML parser 결과는 string이 아닐 수도 있음 (object/array 혼재)
 */
function getString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  return undefined;
}

/**
 * RSS/Atom XML → normalized RSSItem[]
 *
 * === 역할 ===
 * 서로 다른 RSS 구조를 하나의 표준 DTO로 변환
 *
 * === 처리 대상 ===
 * - RSS 2.0: rss.channel.item
 * - Atom: feed.entry
 *
 * === 핵심 ===
 * "파싱 이후에는 구조를 무조건 동일하게 만든다"
 */
function parseRSS(xml: string): RSSItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const data = parser.parse(xml);

  const items = data?.rss?.channel?.item || data?.feed?.entry || [];

  // 단일 object → array 강제 변환 (RSS edge case 대응)
  const normalized = Array.isArray(items) ? items : [items];

  return normalized.map((item: XMLNode): RSSItem => {
    // guid는 RSS/Atom마다 위치가 다름
    const guid = (item.guid as XMLNode)?.["#text"] ?? item.guid ?? item.id;

    return {
      guid: typeof guid === "string" ? guid : null,

      // Atom은 link가 attribute 형태일 수 있음
      link:
        getString((item.link as XMLNode)?.["@_href"]) ??
        getString(item.link) ??
        "",

      title: getString(item.title) ?? "",

      description:
        getString(item.description) ?? getString(item.summary) ?? null,

      content:
        getString((item as XMLNode)["content:encoded"]) ??
        getString(item.content) ??
        null,

      author:
        getString((item.author as XMLNode)?.name) ??
        getString(item.author) ??
        null,

      /**
       * publishedAt 정규화
       * RSS: pubDate
       * Atom: published
       */
      publishedAt: getString(item.pubDate)
        ? new Date(getString(item.pubDate) as string)
        : getString(item.published)
          ? new Date(getString(item.published) as string)
          : null,

      /**
       * category normalization
       * string / array 혼재 대응
       */
      categories: Array.isArray(item.category)
        ? (item.category as string[])
        : item.category
          ? [item.category as string]
          : [],
    };
  });
}

/**
 * FeedItem DB upsert layer
 *
 * === 역할 ===
 * normalized RSSItem → MongoDB 저장 (idempotent ingestion)
 *
 * === 현재 상태 ===
 * - dedup 적용 (guid / hash 기반 upsert)
 * - bulkWrite 기반 저장
 * - 동일 데이터 재실행 시 결과 동일 (idempotent)
 *
 * === 특징 ===
 * - insertMany 제거됨
 * - updateOne → bulkWrite upsert 구조
 * - cron 재실행에도 안전
 *
 * === 의미 ===
 * 이 함수는 "insert"가 아니라
 * RSS feed와 DB를 동기화(sync)하는 ingestion layer이다
 *
 * === 이후 개선 포인트 ===
 * - batch grouping (성능 최적화)
 * - retry/backoff 정책
 * - ETag 기반 fetch optimization
 */
async function upsertFeedItems(feedId: string, items: RSSItem[]) {
  const operations = items.map((item) => {
    const hash = item.link;

    const doc = {
      feedId,
      guid: item.guid ?? null,
      link: item.link,
      title: item.title,
      description: item.description,
      content: item.content,
      author: item.author,
      publishedAt: item.publishedAt,
      categories: item.categories,
      hash,
    };

    /**
     * 1) guid 기반 upsert
     */
    if (item.guid) {
      return {
        updateOne: {
          filter: {
            feedId,
            guid: item.guid,
          },
          update: {
            $setOnInsert: doc,
          },
          upsert: true,
        },
      };
    }

    /**
     * 2) fallback: hash 기반 upsert
     */
    return {
      updateOne: {
        filter: {
          feedId,
          hash,
        },
        update: {
          $setOnInsert: doc,
        },
        upsert: true,
      },
    };
  });

  /**
   * retry-safe bulkWrite 옵션
   */
  const result = await FeedItemModel.bulkWrite(operations, {
    ordered: false, // 중요: 하나 실패해도 계속 진행
  });

  console.log("RSS ingestion result:", {
    upserted: result.upsertedCount,
    modified: result.modifiedCount,
    matched: result.matchedCount,
  });

  return result;
}

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
   * STEP 3: Insert
   * MongoDB 저장
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
