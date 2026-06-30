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
import { Logger } from "pino";

export async function runRssPipeline(params: {
  feed: FeedLean;
  executionId: string;
  feedExecutionLogId: string;
  logger: Logger;
}) {
  const { feed, executionId, feedExecutionLogId, logger } = params;
  const feedId = feed._id.toString();

  let currentStage: FeedExecutionStage = FEED_EXECUTION_STAGE.FETCH;

  logger.info({ feedId, executionId }, "rss.pipeline.start");

  try {
    /**
     * 1. FETCH
     */
    currentStage = FEED_EXECUTION_STAGE.FETCH;

    logger.debug({ feedId }, "rss.pipeline.fetch.start");

    const fetchResult = await fetchRSS(feed, executionId, logger, (log) =>
      feedFetchObservationService.record(log),
    );

    logger.debug({ feedId }, "rss.pipeline.fetch.done");

    /**
     * 2. CACHE CHECK
     */
    currentStage = FEED_EXECUTION_STAGE.CACHE_CHECK;

    logger.debug({ feedId }, "rss.pipeline.cache.check");

    if (fetchResult.type === "NOT_MODIFIED") {
      logger.info({ feedId }, "rss.pipeline.skipped.not_modified");

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

    logger.debug({ feedId }, "rss.pipeline.parse.start");

    const parsed = parseRSS(xml, logger);

    logger.debug({ feedId, count: parsed.length }, "rss.pipeline.parse.done");

    /**
     * 4. PERSIST
     */
    currentStage = FEED_EXECUTION_STAGE.PERSIST;

    logger.debug({ feedId }, "rss.pipeline.persist.start");

    const { result: persistResult, createdItems } = await upsertFeedItems(
      feedId,
      parsed,
      logger,
    );

    logger.info(
      {
        feedId,
        created: createdItems?.length ?? 0,
      },
      "rss.pipeline.persist.done",
    );

    /**
     * USER NOTIFICATION
     */
    logger.debug({ feedId }, "rss.pipeline.notification.start");

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

    logger.info({ feedId }, "rss.pipeline.success");

    /**
     * 6. FEED STATE UPDATE
     */
    await feedIngestionService.handleSuccess({
      feedId,
      etag,
      lastModified,
    });

    logger.debug({ feedId }, "rss.pipeline.state.updated");

    return { skipped: false };
  } catch (err) {
    logger.error({ feedId, stage: currentStage, err }, "rss.pipeline.error");

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

    logger.warn(
      {
        feedId,
        disabled: result.disabled,
      },
      "rss.pipeline.failure.handled",
    );

    return {
      feedId,
      status: "FAILED",
      disabled: result.disabled,
      errorCount: result.errorCount,
    };
  }
}
