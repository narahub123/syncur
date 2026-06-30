import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
  FeedExecutionStage,
} from "@/features/admin/logs/types/search";
import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { feedIngestionService } from "@/features/feeds/service/FeedIngestionService.instance";
import { FeedLean } from "@/features/feeds/types/leans";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import { fetchCrawl } from "./fetchCrawl";
import { extractCrawlerItems } from "../../extractors/extractCrawlerItems";
import { upsertFeedItems } from "@/ingestion/rss/upsertFeedItems";
import { robotsDetector } from "../../detectors/RobotsDetector";
import { Logger } from "pino";

export async function runCrawlPipeline(params: {
  feed: FeedLean;
  executionId: string;
  feedExecutionLogId: string;
  logger: Logger;
}) {
  const { feed, executionId, feedExecutionLogId, logger } = params;
  const feedId = feed._id.toString();

  let currentStage: FeedExecutionStage = FEED_EXECUTION_STAGE.FETCH;

  logger.info({ feedId, executionId }, "crawl.pipeline.start");

  try {
    /**
     * 1. CONFIG 검증
     */
    logger.debug({ feedId }, "crawl.pipeline.config.check");

    if (!feed.listingPageUrl || !feed.listingPageConfig) {
      logger.warn({ feedId }, "crawl.pipeline.config.invalid");

      throw new Error("listingPageUrl 또는 listingPageConfig가 없습니다.");
    }

    /**
     * 2. ROBOTS CHECK
     */
    currentStage = FEED_EXECUTION_STAGE.FETCH;

    logger.debug({ feedId }, "crawl.pipeline.robots.check.start");

    const robotsAllowed = await robotsDetector.detect(
      feed?.listingPageUrl,
      logger,
    );

    logger.debug(
      { feedId, allowed: robotsAllowed },
      "crawl.pipeline.robots.check.done",
    );

    if (!robotsAllowed) {
      logger.info({ feedId }, "crawl.pipeline.skipped.robots");

      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SKIPPED,
        reason: FEED_EXECUTION_REASON.ROBOTS_DISALLOWED,
        finishedAt: new Date(),
      });

      return { skipped: true };
    }

    /**
     * 2. FETCH
     */
    logger.debug({ feedId }, "crawl.pipeline.fetch.start");

    const fetchResult = await fetchCrawl(feed, logger);

    logger.debug(
      { feedId, type: fetchResult.type },
      "crawl.pipeline.fetch.done",
    );

    /**
     * 3. CACHE CHECK
     */
    logger.debug({ feedId }, "crawl.pipeline.cache.check");

    if (fetchResult.type === "NOT_MODIFIED") {
      logger.info({ feedId }, "crawl.pipeline.skipped.not_modified");

      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SKIPPED,
        reason: FEED_EXECUTION_REASON.FETCH_NOT_MODIFIED,
        finishedAt: new Date(),
        fetch: {
          url: feed.listingPageUrl,
          cache: { hit: true },
        },
      });

      return { skipped: true };
    }

    const { html, finalUrl } = fetchResult;

    /**
     * 4. PARSE
     */
    currentStage = FEED_EXECUTION_STAGE.PARSE;

    logger.debug({ feedId }, "crawl.pipeline.parse.start");

    const parsedItems = extractCrawlerItems(
      html,
      feed.listingPageConfig,
      finalUrl,
      logger,
      feed.crawlerState?.lastSeenUrl ?? undefined,
    );

    logger.debug(
      { feedId, count: parsedItems.length },
      "crawl.pipeline.parse.done",
    );

    /**
     * 5. PERSIST
     */
    currentStage = FEED_EXECUTION_STAGE.PERSIST;

    logger.debug({ feedId }, "crawl.pipeline.persist.start");

    const { result: persistResult, createdItems } = await upsertFeedItems(
      feedId,
      parsedItems,
      logger,
    );

    logger.info(
      {
        feedId,
        created: createdItems?.length ?? 0,
      },
      "crawl.pipeline.persist.done",
    );

    /**
     * USER NOTIFICATION
     */
    logger.debug({ feedId }, "crawl.pipeline.notification.start");

    await notificationService.createFeedItemNotifications({
      feedId,
      createdItems,
    });

    /**
     * 6. SUCCESS
     */
    await feedExecutionLogService.updateExecution(executionId, {
      status: FEED_EXECUTION_STATUS.SUCCESS,
      finishedAt: new Date(),
      fetch: {
        url: feed.listingPageUrl,
        cache: { hit: false },
      },
      parse: {
        normalizedCount: parsedItems.length,
      },
      persist: {
        upserted: persistResult.upsertedCount ?? 0,
        matched: persistResult.matchedCount ?? 0,
        modified: persistResult.modifiedCount ?? 0,
      },
    });

    logger.info({ feedId }, "crawl.pipeline.success");

    /**
     * 7. FEED STATE UPDATE
     */
    await feedIngestionService.handleSuccess({
      feedId,
      lastSeenUrl: createdItems[0]?.link ?? undefined,
    });

    logger.debug({ feedId }, "crawl.pipeline.state.updated");

    return { skipped: false };
  } catch (err) {
    logger.error({ feedId, stage: currentStage, err }, "crawl.pipeline.error");

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
      "crawl.pipeline.failure.handled",
    );

    return {
      feedId,
      status: "FAILED",
      disabled: result.disabled,
      errorCount: result.errorCount,
    };
  }
}
