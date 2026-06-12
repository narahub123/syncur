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
    reason: log.reason,

    startedAt: log.startedAt.toISOString(),
    finishedAt: log.finishedAt?.toISOString() ?? null,
    durationMs: log.durationMs ?? null,

    httpStatus: log.httpStatus ?? null,
    cacheHit: log.cacheHit ?? false,

    fetch: log.fetch ?? null,
    parse: log.parse ?? null,
    persist: log.persist ?? null,

    fetchedCount: log.fetchedCount ?? 0,
    insertedCount: log.insertedCount ?? 0,

    error: log.error ?? null,
    failedAtStage: log.failedAtStage ?? null,

    createdAt: log.createdAt.toISOString(),
    updatedAt: log.updatedAt.toISOString(),
  };
}
