import {
  FeedExecutionReason,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";
import { FeedExecutionLogWithFeedAndSiteDto } from "../dto/feedExecutionLogDto";
import { FeedExecutionLogWithFeedAndSiteLean } from "../types/lean";

export function toFeedExecutionLogWithFeedAndSiteDto(
  log: FeedExecutionLogWithFeedAndSiteLean,
): FeedExecutionLogWithFeedAndSiteDto {
  return {
    _id: log._id.toString(),

    executionId: log.executionId,

    status: log.status as FeedExecutionStatus,
    reason: (log.reason as FeedExecutionReason) ?? null,

    startedAt: log.startedAt.toISOString(),
    finishedAt: log.finishedAt?.toISOString() ?? null,
    durationMs: log.durationMs ?? null,

    failedAtStage: log.failedAtStage ?? null,

    /**
     * stage logs
     */
    fetch: log.fetch ?? null,
    parse: log.parse ?? null,
    persist: log.persist ?? null,

    /**
     * error
     */
    error: log.error
      ? {
          type: log.error.type ?? null,
          message: log.error.message ?? null,
          stack: log.error.stack ?? null,
        }
      : null,

    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),

    /**
     * feed info
     */
    feed: log.feed
      ? {
          _id: log.feed._id.toString(),
          feedUrl: log.feed.feedUrl,
          status: log.feed.status,
        }
      : null,

    /**
     * site info
     */
    site: log.site
      ? {
          _id: log.site._id.toString(),
          url: log.site.url,
          name: log.site.name,
          faviconUrl: log.site.favicon_url ?? null,
        }
      : null,
  };
}
