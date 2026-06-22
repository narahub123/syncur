import { FeedFetchObservationDTO } from "../dtos/feedFetchObservationDTO";
import { FeedFetchObservationLean } from "../types/leans";

/**
 * Lean → DTO 변환
 */
export function toFeedFetchObservationDTO(
  log: FeedFetchObservationLean,
): FeedFetchObservationDTO {
  return {
    _id: log._id.toString(),
    executionId: log.executionId,
    feedId: log.feedId.toString(),
    feedUrl: log.feedUrl,

    attempt: log.attempt,

    startTime: log.startTime.getTime(),
    endTime: log.endTime.getTime(),
    durationMs: log.durationMs,

    success: log.success,

    errorCode: log.errorCode ?? undefined,
    errorMessage: log.errorMessage ?? undefined,

    createdAt: log.createdAt.toISOString() ?? "",
    updatedAt: log.updatedAt.toISOString() ?? "",
  };
}

export const toFeedFetchObservationDTOs = (
  logs: FeedFetchObservationLean[],
): FeedFetchObservationDTO[] => logs.map(toFeedFetchObservationDTO);
