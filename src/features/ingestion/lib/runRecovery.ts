import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { feedFetchObservationService } from "@/features/feed-fetch-observation/services/FeedFetchObservationService.instance";
import { FeedModel } from "@/features/feeds/model/feed";
import { fetchRSS } from "@/features/ingestion/lib/rss/fetchRss";
import { parseRSS } from "@/features/ingestion/lib/rss/parseRss";
import { RSS_CONFIG } from "@/features/ingestion/lib/rss/rss-config";
import { fetchCrawl } from "./pipelines/crawl/fetchCrawl";
import { recoveryLogger } from "../logger/pipelines";
import { createTraceId } from "../logger/trace-id";
import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
} from "@/features/admin/logs/types/search";
import { FeedExecutionStage } from "@/features/admin/logs/types/search";

export async function runRecovery() {
  /**
   * RUN CONTEXT
   */
  const traceId = createTraceId();
  const runLogger = recoveryLogger.child({ traceId });

  runLogger.debug({ traceId }, "recovery.start");

  /**
   * 1. 후보 조회
   */
  const feeds = await FeedModel.find({
    status: RSS_CONFIG.STATUS.DISABLED,
    disabledAt: {
      $lt: new Date(Date.now() - RSS_CONFIG.RECOVERY_COOLDOWN_MS),
    },
  });

  for (const feed of feeds) {
    const execution = await feedExecutionLogService.startExecution(feed._id);
    const executionId = execution.executionId;
    const feedExecutionLogId = execution.id;
    const feedId = feed._id.toString();
    const feedUrl = feed.feedUrl ?? feed.listingPageUrl ?? "unknown";

    /**
     * FEED LOGGER (ingestion 통일 구조)
     */
    const feedLogger = runLogger.child({
      feedId,
      executionId,
      feedExecutionLogId,
    });

    feedLogger.debug({ feedId }, "recovery.feed.start");

    /**
     * PIPELINE LOGGER
     */
    const pipelineLogger = feedLogger.child({
      pipeline: feed.sourceType,
    });

    let currentStage: FeedExecutionStage = FEED_EXECUTION_STAGE.FETCH;

    try {
      /**
       * =========================
       * RSS RECOVERY
       * =========================
       */
      if (feed.sourceType === "rss") {
        pipelineLogger.info({ feedUrl }, "recovery.rss.fetch.start");

        currentStage = FEED_EXECUTION_STAGE.FETCH;

        const result = await fetchRSS(
          feed.toObject(),
          executionId,
          pipelineLogger,
          (log) => feedFetchObservationService.record(log),
        );

        /**
         * NOT MODIFIED → 즉시 복구
         */
        if (result.type === "NOT_MODIFIED") {
          await FeedModel.updateOne(
            { _id: feed._id },
            {
              $set: {
                status: RSS_CONFIG.STATUS.ACTIVE,
                errorCount: 0,
                lastFetchedAt: new Date(),
              },
              $unset: { disabledAt: 1 },
            },
          );

          await feedExecutionLogService.updateExecution(executionId, {
            status: FEED_EXECUTION_STATUS.SKIPPED,
            reason: FEED_EXECUTION_REASON.FETCH_NOT_MODIFIED,
            finishedAt: new Date(),
          });

          pipelineLogger.info({ feedUrl }, "recovery.rss.cached");
          continue;
        }

        /**
         * OK → parse validation only
         */
        currentStage = FEED_EXECUTION_STAGE.PARSE;

        parseRSS(result.xml, pipelineLogger);

        pipelineLogger.info({ feedUrl }, "recovery.rss.valid");
      } else if (feed.sourceType === "crawl") {
        /**
         * =========================
         * CRAWL RECOVERY
         * =========================
         */
        pipelineLogger.info({ feedUrl }, "recovery.crawl.fetch.start");

        currentStage = FEED_EXECUTION_STAGE.FETCH;

        const result = await fetchCrawl(feed.toObject(), pipelineLogger);

        if (result.type === "NOT_MODIFIED") {
          await FeedModel.updateOne(
            { _id: feed._id },
            {
              $set: {
                status: RSS_CONFIG.STATUS.ACTIVE,
                errorCount: 0,
                lastFetchedAt: new Date(),
              },
              $unset: { disabledAt: 1 },
            },
          );

          await feedExecutionLogService.updateExecution(executionId, {
            status: FEED_EXECUTION_STATUS.SKIPPED,
            reason: FEED_EXECUTION_REASON.FETCH_NOT_MODIFIED,
            finishedAt: new Date(),
          });

          pipelineLogger.info({ feedUrl }, "recovery.crawl.cached");
          continue;
        }

        pipelineLogger.info({ feedUrl }, "recovery.crawl.valid");
      }

      /**
       * =========================
       * SUCCESS RECOVERY
       * =========================
       */
      await FeedModel.updateOne(
        { _id: feed._id },
        {
          $set: {
            status: RSS_CONFIG.STATUS.ACTIVE,
            errorCount: 0,
            lastFetchedAt: new Date(),
          },
          $unset: { disabledAt: 1 },
        },
      );

      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SUCCESS,
        finishedAt: new Date(),
      });

      feedLogger.info({ feedUrl }, "recovery.success");
    } catch (err) {
      /**
       * =========================
       * FAIL RECOVERY
       * =========================
       */
      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.FAILED,
        reason:
          currentStage === FEED_EXECUTION_STAGE.FETCH
            ? FEED_EXECUTION_REASON.FETCH_ERROR
            : FEED_EXECUTION_REASON.PARSE_ERROR,
        failedAtStage: currentStage,
        finishedAt: new Date(),
        error: {
          type:
            currentStage === FEED_EXECUTION_STAGE.FETCH
              ? FEED_EXECUTION_ERROR_TYPE.HTTP_ERROR
              : FEED_EXECUTION_ERROR_TYPE.XML_PARSE_ERROR,
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        },
      });

      await FeedModel.updateOne(
        { _id: feed._id },
        { $set: { disabledAt: new Date() } },
      );

      feedLogger.error(
        {
          feedUrl,
          err,
        },
        "recovery.failed",
      );
    }
  }
}
