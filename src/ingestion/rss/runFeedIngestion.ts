import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { FeedLean } from "@/shared/types/domain-leans";
import { RSS_CONFIG } from "./rss-config";
import { fetchRSS } from "./fetchRss";
import { parseRSS } from "./parseRss";
import { upsertFeedItems } from "./upsertFeedItems";
import { feedIngestionService } from "@/features/feeds/service/FeedIngestionService.instance";
import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STATUS,
  FeedExecutionStage,
} from "@/features/feed-execution-logs/constants/feed-execution-log";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";

export async function runFeedIngestion(feed: FeedLean) {
  const feedId = feed._id.toString();

  const execution = await feedExecutionLogService.startExecution(feedId);
  const executionId = execution.executionId;
  const feedExecutionLogId = execution.id;

  /**
   * 현재 stage 추적용 변수 (핵심)
   */
  let currentStage: FeedExecutionStage = "fetch";

  try {
    /**
     * 1. DISABLED CHECK
     */
    if (feed.status === RSS_CONFIG.STATUS.DISABLED) {
      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SKIPPED,
        reason: FEED_EXECUTION_REASON.DISABLED_FEED,
        finishedAt: new Date(),
      });

      return;
    }

    /**
     * 2. FETCH
     */
    currentStage = "fetch";
    await feedExecutionLogService.updateStage(executionId, currentStage);

    const fetchResult = await fetchRSS(feed);

    /**
     * 3. CACHE CHECK
     */
    currentStage = "cache_check";
    await feedExecutionLogService.updateStage(executionId, currentStage);

    if (fetchResult.type === "NOT_MODIFIED") {
      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SKIPPED,
        reason: FEED_EXECUTION_REASON.FETCH_NOT_MODIFIED,
        finishedAt: new Date(),
        fetch: {
          url: feed.feedUrl,
          cacheResult: "HIT",
        },
      });

      return;
    }

    const { xml, etag, lastModified } = fetchResult;

    /**
     * 4. PARSE
     */
    currentStage = "parse";
    await feedExecutionLogService.updateStage(executionId, currentStage);

    const parsed = parseRSS(xml);

    /**
     * 5. PERSIST
     */
    currentStage = "persist";
    await feedExecutionLogService.updateStage(executionId, currentStage);

    const persistResult = await upsertFeedItems(feedId, parsed);

    /**
     * 6. SUCCESS
     */
    await feedExecutionLogService.updateExecution(executionId, {
      status: FEED_EXECUTION_STATUS.SUCCESS,
      reason: undefined,
      finishedAt: new Date(),
      fetch: {
        url: feed.feedUrl,
        etag,
        lastModified,
      },
      parse: {
        normalizedCount: parsed.length,
      },
      persist: {
        upserted: persistResult.upsertedCount ?? 0,
        matched: persistResult.matchedCount ?? 0,
        modified: persistResult.modifiedCount ?? 0,
      },
    });

    /**
     * 7. FEED STATE UPDATE (projection)
     */
    await feedIngestionService.handleSuccess({
      feedId,
      etag,
      lastModified,
    });
  } catch (err) {
    /**
     * ERROR → stage 기반으로 결정 (중요)
     */
    const reason =
      currentStage === "fetch"
        ? FEED_EXECUTION_REASON.FETCH_ERROR
        : currentStage === "cache_check"
          ? FEED_EXECUTION_REASON.FETCH_ERROR
          : currentStage === "parse"
            ? FEED_EXECUTION_REASON.PARSE_ERROR
            : FEED_EXECUTION_REASON.PERSIST_ERROR;

    const errorType =
      currentStage === "fetch"
        ? FEED_EXECUTION_ERROR_TYPE.HTTP_ERROR
        : currentStage === "parse"
          ? FEED_EXECUTION_ERROR_TYPE.XML_PARSE_ERROR
          : FEED_EXECUTION_ERROR_TYPE.DB_ERROR;

    /**
     * 8. FAIL EXECUTION
     */
    await feedExecutionLogService.updateExecution(executionId, {
      status: FEED_EXECUTION_STATUS.FAILED,
      reason,
      failedAtStage: currentStage,
      finishedAt: new Date(),
      error: {
        type: errorType,
        message: err instanceof Error ? err.message : String(err),
      },
    });

    /**
     * RSS 실행 중 에러가 발생한 경우
     * 모든 관리자에게 알림을 전송한다.
     */
    await notificationService.createAdminErrorNotification({
      siteId: feed.siteId.toString(),
      feedId,
      feedExecutionLogId,
      stage: currentStage,
      errorMessage: err instanceof Error ? err.message : String(err),
    });

    /**
     * 9. FEED POLICY UPDATE
     */
    const result = await feedIngestionService.handleFailure(feedId);

    return {
      feedId,
      status: "FAILED",
      disabled: result.disabled,
      errorCount: result.errorCount,
    };
  }
}
