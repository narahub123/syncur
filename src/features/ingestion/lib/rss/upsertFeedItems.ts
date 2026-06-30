import { FeedItemModel } from "@/features/feed-items/models/feed-item";
import { FeedItemInput } from "@/features/feed-sample/types";
import { Logger } from "pino";

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
export async function upsertFeedItems(
  feedId: string,
  items: FeedItemInput[],
  logger: Logger,
) {
  const operations = items.map((item) => {
    const hash = item.link;

    const doc = {
      feedId,
      guid: item.guid ?? null,
      link: item.link,
      title: item.title,
      description: item.description ?? "",
      author: item.author ?? null,
      publishedAt: item.publishedAt ?? null,
      categories: item.categories ?? [],
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

  logger?.info(
    {
      feedId,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    },
    "feed.upsert.result",
  );

  /**
   * 신규 생성된 FeedItem 추출
   *
   * bulkWrite의 upsertedIds는
   * operation index → 생성된 ObjectId 매핑이다.
   */
  const createdItems = Object.entries(result.upsertedIds).map(
    ([index, objectId]) => {
      const item = items[Number(index)];

      return {
        feedItemId: objectId.toString(),

        title: item.title,
        link: item.link,

        guid: item.guid ?? undefined,
      };
    },
  );

  return {
    result,
    createdItems,
  };
}
