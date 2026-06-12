import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { FeedLean } from "@/shared/types/domain-leans";
import { RSS_CONFIG } from "./rss-config";
import { fetchRSS } from "./fetchRss";
import { parseRSS } from "./parseRss";
import { upsertFeedItems } from "./upsertFeedItems";
import { feedIngestionService } from "@/features/feeds/service/FeedIngestionService.instance";

export async function runFeedIngestion(feed: FeedLean) {
  const feedId = feed._id.toString();

  const execution = await feedExecutionLogService.startExecution(feedId);
  const executionId = execution.executionId;

  /**
   * 현재 stage 추적용 변수 (핵심)
   */
  let currentStage: "fetch" | "cache_check" | "parse" | "persist" = "fetch";

  try {
    /**
     * 1. DISABLED CHECK
     */
    if (feed.status === RSS_CONFIG.STATUS.DISABLED) {
      await feedExecutionLogService.updateExecution(executionId, {
        status: "SKIPPED",
        reason: "DISABLED_FEED",
        timing: {
          finishedAt: new Date(),
        },
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
        status: "SKIPPED",
        reason: "FETCH_NOT_MODIFIED",
        timing: {
          finishedAt: new Date(),
        },
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
      status: "SUCCESS",
      reason: undefined,
      timing: {
        finishedAt: new Date(),
      },
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
        ? "FETCH_ERROR"
        : currentStage === "cache_check"
          ? "FETCH_ERROR"
          : currentStage === "parse"
            ? "PARSE_ERROR"
            : "PERSIST_ERROR";

    const errorType =
      currentStage === "fetch"
        ? "HTTP_ERROR"
        : currentStage === "parse"
          ? "XML_PARSE_ERROR"
          : "DB_ERROR";

    /**
     * 8. FAIL EXECUTION
     */
    await feedExecutionLogService.updateExecution(executionId, {
      status: "FAILED",
      reason,
      timing: {
        finishedAt: new Date(),
      },
      error: {
        type: errorType,
        message: err instanceof Error ? err.message : String(err),
      },
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
