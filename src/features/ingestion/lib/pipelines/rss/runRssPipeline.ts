import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
  FeedExecutionStage,
} from "@/features/admin/logs/types/search";
import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { feedFetchObservationService } from "@/features/feed-fetch-observation/services/FeedFetchObservationService.instance";
import { feedIngestionService } from "@/features/feeds/service/FeedIngestionService.instance";
import { FeedLean } from "@/features/feeds/types/leans";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { fetchRSS } from "@/ingestion/rss/fetchRss";
import { parseRSS } from "@/ingestion/rss/parseRss";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";

export async function runRssPipeline(params: {
  feed: FeedLean;
  executionId: string;
  feedExecutionLogId: string;
}) {
  const { feed, executionId, feedExecutionLogId } = params;
  const feedId = feed._id.toString();

  let currentStage: FeedExecutionStage = FEED_EXECUTION_STAGE.FETCH;

  try {
    /**
     * 1. FETCH
     */
    currentStage = FEED_EXECUTION_STAGE.FETCH;
    const fetchResult = await fetchRSS(feed, executionId, (log) =>
      feedFetchObservationService.record(log),
    );

    /**
     * 2. CACHE CHECK
     */
    currentStage = FEED_EXECUTION_STAGE.CACHE_CHECK;

    if (fetchResult.type === "NOT_MODIFIED") {
      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SKIPPED,
        reason: FEED_EXECUTION_REASON.FETCH_NOT_MODIFIED,
        finishedAt: new Date(),
        fetch: {
          url: feed.feedUrl!,
          cache: { hit: true },
        },
      });

      return { skipped: true };
    }

    const { xml, etag, lastModified } = fetchResult;

    /**
     * 3. PARSE
     */
    currentStage = FEED_EXECUTION_STAGE.PARSE;
    const parsed = parseRSS(xml);

    /**
     * 4. PERSIST
     */
    currentStage = FEED_EXECUTION_STAGE.PERSIST;
    const { result: persistResult, createdItems } = await upsertFeedItems(
      feedId,
      parsed,
    );

    /**
     * USER NOTIFICATION
     */
    await notificationService.createFeedItemNotifications({
      feedId,
      createdItems,
    });

    /**
     * 5. SUCCESS
     */
    await feedExecutionLogService.updateExecution(executionId, {
      status: FEED_EXECUTION_STATUS.SUCCESS,
      finishedAt: new Date(),
      fetch: {
        url: feed.feedUrl!,
        etag,
        lastModified,
        cache: { hit: false },
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
     * 6. FEED STATE UPDATE
     */
    await feedIngestionService.handleSuccess({
      feedId,
      etag,
      lastModified,
    });

    return { skipped: false };
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
     * FAIL EXECUTION
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
