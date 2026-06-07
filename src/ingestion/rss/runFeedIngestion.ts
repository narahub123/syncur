import { FeedDocument, FeedModel } from "@/features/feeds/model/feed";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";
import { RSS_CONFIG } from "./rss-config";
import { classifyRSSFailure } from "./classifyRSSFailure";
import { INGESTION_RESULT } from "./types";

/**
 * RSS Feed ingestion unit
 *
 * === 역할 ===
 * - cron / worker 어디서든 재사용 가능
 * - feed 1개 단위 ingestion 처리
 * - idempotent (재실행 안전)
 *
 * === 상태 모델 ===
 * active   : 정상 수집 대상
 * disabled : 더 이상 수집하지 않는 feed
 *
 * === 설계 원칙 ===
 * - Feed.status는 "생존 여부"만 관리 (active / disabled)
 * - 실행 결과는 INGESTION_RESULT로 분리
 * - 실패 판단은 errorCount + failureType 기반
 */
export async function runFeedIngestion(feed: FeedDocument) {
  const feedId = feed._id.toString();

  try {
    /**
     * 0. 상태 가드
     * - disabled feed는 더 이상 ingestion 하지 않음
     */
    if (feed.status === RSS_CONFIG.STATUS.DISABLED) {
      return {
        feedId,
        status: INGESTION_RESULT.SKIPPED_DISABLED,
      };
    }

    /**
     * 1. RSS Fetch (retry 포함)
     * - 네트워크 안정성은 fetchRSS 내부에서 처리
     */
    const result = await fetchRSS(feed);

    if (result.type === "NOT_MODIFIED") {
      return {
        feedId,
        status: INGESTION_RESULT.SKIPPED_CACHE,
      };
    }

    const xml = result.xml;
    const etag = result.etag;
    const lastModified = result.lastModified;

    /**
     * 2. XML Parse → normalized items
     */
    const items = parseRSS(xml);

    /**
     * 3. Idempotent Upsert
     * - 동일 item 재수집에도 안전해야 함
     */
    await upsertFeedItems(feedId, items);

    /**
     * 4. 성공 처리
     *
     * - lastFetchedAt 업데이트
     * - errorCount 초기화 (연속 실패 리셋)
     */
    await FeedModel.updateOne(
      { _id: feed._id },
      {
        $set: {
          lastFetchedAt: new Date(),
          errorCount: 0,

          ...(etag && { etag }),
          ...(lastModified && { lastModified }),
        },
      },
    );

    return {
      feedId,
      status: INGESTION_RESULT.SUCCESS,
      items: items.length,
    };
  } catch (err) {
    /**
     * 5. failure type 분류
     * - retry 정책과는 별개로 "의미 분석 단계"
     */
    const type = classifyRSSFailure(err);

    /**
     * 6. errorCount 증가 (모든 실패 공통)
     * - Feed 상태(active/disabled)는 여기서 변경하지 않음
     */
    const updated = await FeedModel.findByIdAndUpdate(
      feed._id,
      {
        $inc: { errorCount: 1 },
      },
      { new: true },
    );

    /**
     * 7. disabled 전환 정책
     *
     * - 모든 failure type 공통 적용
     * - errorCount가 threshold 초과 시에만 disabled
     */
    const errorCount = updated?.errorCount ?? 0;

    if (errorCount >= RSS_CONFIG.ERROR_THRESHOLD) {
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: {
            status: RSS_CONFIG.STATUS.DISABLED,
          },
        },
      );

      return {
        feedId,
        status: INGESTION_RESULT.DISABLED_TRIGGERED,
        type,
        errorCount: updated.errorCount ?? 0,
      };
    }

    /**
     * 8. PARSE error
     * - XML 구조/데이터 문제
     */
    if (type === "PARSE") {
      return {
        feedId,
        status: INGESTION_RESULT.PARSE_ERROR,
        type,
        errorCount: updated?.errorCount ?? 0,
      };
    }

    /**
     * 9. 일반 ERROR (NETWORK / HTTP / UNKNOWN)
     */
    return {
      feedId,
      status: INGESTION_RESULT.ERROR,
      type,
      errorCount: updated?.errorCount ?? 0,
    };
  }
}
