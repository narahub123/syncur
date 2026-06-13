import { FeedExecutionLogDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { FeedExecutionLogLean } from "../types/lean";

export function toFeedExecutionLogDto(
  log: FeedExecutionLogLean,
): FeedExecutionLogDto {
  return {
    _id: log._id.toString(),

    feedId: log.feedId.toString(),
    executionId: log.executionId,

    status: log.status,
    reason: log.reason ?? null,

    startedAt: log.startedAt.toISOString(),
    finishedAt: log.finishedAt?.toISOString() ?? null,
    durationMs: log.durationMs ?? null,

    failedAtStage: log.failedAtStage ?? null,

    /**
     * stage logs (그대로 전달)
     */
    fetch: log.fetch ?? null,
    parse: log.parse ?? null,
    persist: log.persist ?? null,

    error: log.error ?? null,

    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  };
}
