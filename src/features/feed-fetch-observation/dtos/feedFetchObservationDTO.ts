export type FeedFetchObservationCreateDTO = {
  executionId: string;
  feedId: string;
  feedUrl: string;
  attempt: number;

  startTime: number;
  endTime: number;
  durationMs: number;

  success: boolean;

  errorCode?: string;
  errorMessage?: string;
};

/**
 * FeedFetchObservation DTO
 *
 * === 역할 ===
 * - fetchRSS observer → ObservationService 전달용
 * - DB 구조 의존 제거
 */
export type FeedFetchObservationDTO = {
  _id: string;

  executionId: string;
  feedId: string;
  feedUrl: string;

  attempt: number;

  startTime: number;
  endTime: number;
  durationMs: number;

  success: boolean;

  errorCode?: string;
  errorMessage?: string;

  createdAt: string;
  updatedAt: string;
};
