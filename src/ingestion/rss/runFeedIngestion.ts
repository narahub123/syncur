import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";
import { RSS_CONFIG } from "./rss-config";
import { classifyRSSFailure } from "./classifyRSSFailure";
import { INGESTION_RESULT } from "./types";
import { FeedLean } from "@/shared/types/domain-leans";

import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { feedIngestionService } from "@/features/feeds/service/FeedIngestionService.instance";
import { FEED_EXECUTION_STAGE } from "@/features/feed-execution-logs/constants/feed-execution-log";

/**
 * RSS Feed ingestion unit (FINAL VERSION)
 *
 * === 역할 ===
 * - feed 1개 단위 ingestion 처리
 * - execution lifecycle 관리 (observability)
 * - feed 상태 업데이트 (policy layer)
 */
export async function runFeedIngestion(feed: FeedLean) {
  const feedId = feed._id.toString();

  /**
   * 1. execution 시작
   */
  const execution = await feedExecutionLogService.startExecution(feedId);
  const executionId = execution.executionId;

  try {
    /**
     * 2. 상태 가드
     */
    if (feed.status === RSS_CONFIG.STATUS.DISABLED) {
      await feedExecutionLogService.successExecution(executionId, {
        fetchedCount: 0,
      });

      return {
        feedId,
        status: INGESTION_RESULT.SKIPPED_DISABLED,
      };
    }

    /**
     * 3. FETCH
     */
    await feedExecutionLogService.updateStage(
      executionId,
      FEED_EXECUTION_STAGE.FETCH,
    );

    const result = await fetchRSS(feed);

    /**
     * 4. CACHE CHECK
     */
    await feedExecutionLogService.updateStage(
      executionId,
      FEED_EXECUTION_STAGE.CACHE_CHECK,
    );

    if (result.type === "NOT_MODIFIED") {
      await feedExecutionLogService.successExecution(executionId, {
        fetchedCount: 0,
      });

      return {
        feedId,
        status: INGESTION_RESULT.SKIPPED_CACHE,
      };
    }

    const { xml, etag, lastModified } = result;

    /**
     * 5. PARSE
     */
    await feedExecutionLogService.updateStage(
      executionId,
      FEED_EXECUTION_STAGE.PARSE,
    );

    const items = parseRSS(xml);

    /**
     * 6. PERSIST
     */
    await feedExecutionLogService.updateStage(
      executionId,
      FEED_EXECUTION_STAGE.PERSIST,
    );

    const upsertResult = await upsertFeedItems(feedId, items);

    /**
     * 7. Feed 상태 업데이트 (policy layer)
     */
    await feedIngestionService.handleSuccess({
      feedId,
      etag,
      lastModified,
    });

    /**
     * 8. SUCCESS 종료
     */
    await feedExecutionLogService.successExecution(executionId, {
      fetchedCount: items.length,
      insertedCount: upsertResult?.upsertedCount ?? 0,
    });

    return {
      feedId,
      status: INGESTION_RESULT.SUCCESS,
      items: items.length,
    };
  } catch (err) {
    /**
     * 9. ERROR 처리
     */
    const type = classifyRSSFailure(err);

    await feedExecutionLogService.failExecution(
      executionId,
      err,
      type === "PARSE" ? FEED_EXECUTION_STAGE.PARSE : undefined,
    );

    /**
     * 10. Feed 실패 처리 (단일 호출로 정리)
     */
    const result = await feedIngestionService.handleFailure(feedId);

    const errorCount = result.errorCount;

    if (result.disabled) {
      return {
        feedId,
        status: INGESTION_RESULT.DISABLED_TRIGGERED,
        type,
        errorCount,
      };
    }

    /**
     * 11. ERROR 응답
     */
    return {
      feedId,
      status:
        type === "PARSE"
          ? INGESTION_RESULT.PARSE_ERROR
          : INGESTION_RESULT.ERROR,
      type,
      errorCount,
    };
  }
}
