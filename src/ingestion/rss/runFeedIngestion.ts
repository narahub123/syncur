import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
  FeedExecutionStage,
} from "@/features/feed-execution-logs/constants/feed-execution-log";
import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { FeedLean } from "@/shared/types/domain-leans";
import { RSS_CONFIG } from "./rss-config";
import { fetchRSS } from "./fetchRss";
import { parseRSS } from "./parseRss";
import { upsertFeedItems } from "./upsertFeedItems";
import { feedIngestionService } from "@/features/feeds/service/FeedIngestionService.instance";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";

export async function runFeedIngestion(feed: FeedLean) {
  const feedId = feed._id.toString();

  const execution = await feedExecutionLogService.startExecution(feedId);
  const executionId = execution.executionId;
  const feedExecutionLogId = execution.id;

  let currentStage: FeedExecutionStage = FEED_EXECUTION_STAGE.FETCH;

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
    currentStage = FEED_EXECUTION_STAGE.FETCH;

    const fetchResult = await fetchRSS(feed);

    /**
     * 3. CACHE CHECK
     */
    currentStage = FEED_EXECUTION_STAGE.CACHE_CHECK;

    if (fetchResult.type === "NOT_MODIFIED") {
      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SKIPPED,
        reason: FEED_EXECUTION_REASON.FETCH_NOT_MODIFIED,
        finishedAt: new Date(),
        fetch: {
          url: feed.feedUrl,
          cache: {
            hit: true,
          },
        },
      });

      return;
    }

    const { xml, etag, lastModified } = fetchResult;

    /**
     * 4. PARSE
     */
    currentStage = FEED_EXECUTION_STAGE.PARSE;
    const parsed = parseRSS(xml);

    /**
     * 5. PERSIST
     */
    currentStage = FEED_EXECUTION_STAGE.PERSIST;
    const persistResult = await upsertFeedItems(feedId, parsed);

    /**
     * 6. SUCCESS
     */
    await feedExecutionLogService.updateExecution(executionId, {
      status: FEED_EXECUTION_STATUS.SUCCESS,
      finishedAt: new Date(),

      fetch: {
        url: feed.feedUrl,
        etag,
        lastModified,
        cache: {
          hit: false,
        },
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
     * 7. FEED STATE UPDATE
     */
    await feedIngestionService.handleSuccess({
      feedId,
      etag,
      lastModified,
    });
  } catch (err) {
    const reason =
      currentStage === FEED_EXECUTION_STAGE.FETCH
        ? FEED_EXECUTION_REASON.FETCH_ERROR
        : currentStage === FEED_EXECUTION_STAGE.PARSE
          ? FEED_EXECUTION_REASON.PARSE_ERROR
          : currentStage === FEED_EXECUTION_STAGE.PERSIST
            ? FEED_EXECUTION_REASON.PERSIST_ERROR
            : FEED_EXECUTION_REASON.FETCH_ERROR;

    const errorType =
      currentStage === FEED_EXECUTION_STAGE.FETCH
        ? FEED_EXECUTION_ERROR_TYPE.HTTP_ERROR
        : currentStage === FEED_EXECUTION_STAGE.PARSE
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
        stack: err instanceof Error ? err.stack : undefined,
      },
    });

    /**
     * ADMIN NOTIFICATION
     */
    await notificationService.createAdminErrorNotification({
      siteId: feed.siteId.toString(),
      feedId,
      feedExecutionLogId,
      stage: currentStage,
      errorMessage: err instanceof Error ? err.message : String(err),
    });

    /**
     * FEED FAILURE POLICY
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
