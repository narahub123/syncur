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

export async function runCrawlPipeline(params: {
  feed: FeedLean;
  executionId: string;
  feedExecutionLogId: string;
}) {
  const { feed, executionId, feedExecutionLogId } = params;
  const feedId = feed._id.toString();

  let currentStage: FeedExecutionStage = FEED_EXECUTION_STAGE.FETCH;

  try {
    /**
     * 1. CONFIG 검증
     */
    if (!feed.listingPageUrl || !feed.listingPageConfig) {
      throw new Error("listingPageUrl 또는 listingPageConfig가 없습니다.");
    }

    /**
     * 2. FETCH
     *
     * static  → fetchSite (HTTP)
     * dynamic → fetchDynamicSite (Puppeteer, JS 렌더링 완료 후 HTML 반환)
     * 두 경우 모두 렌더링된 HTML string을 반환하므로
     * 이후 파싱은 extractCrawlerItems (Cheerio)로 통일
     */
    currentStage = FEED_EXECUTION_STAGE.FETCH;
    const fetchResult = await fetchCrawl(feed);

    /**
     * 3. CACHE CHECK
     *
     * 현재는 NOT_MODIFIED 미지원
     * 추후 lastSeenUrl 기반 변경 감지 확장 포인트
     */
    if (fetchResult.type === "NOT_MODIFIED") {
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
     *
     * static/dynamic 모두 렌더링된 HTML이므로 Cheerio로 통일
     * 무한 스크롤 등 추가 인터랙션이 필요한 경우
     * extractCrawlerItemsDynamic 확장 포인트
     */

    currentStage = FEED_EXECUTION_STAGE.PARSE;
    const parsedItems = extractCrawlerItems(
      html,
      feed.listingPageConfig,
      finalUrl,
      feed.crawlerState?.lastSeenUrl ?? undefined, // 추가
    );

    /**
     * 5. PERSIST
     */
    currentStage = FEED_EXECUTION_STAGE.PERSIST;
    const { result: persistResult, createdItems } = await upsertFeedItems(
      feedId,
      parsedItems,
    );

    /**
     * USER NOTIFICATION
     */
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

    /**
     * 7. FEED STATE UPDATE
     */
    await feedIngestionService.handleSuccess({
      feedId,
      lastSeenUrl: createdItems[0]?.link ?? undefined,
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
