import { FeedFetchObservationCreateDTO } from "@/features/feed-fetch-observation/dtos/feedFetchObservationDTO";

type PartialObservation = Omit<
  FeedFetchObservationCreateDTO,
  "executionId" | "feedId"
>;

/**
 * Observation Collector
 *
 * === 역할 ===
 * - RSS fetch 과정에서 발생한 observation을 임시 저장
 * - retry loop 동안 발생한 로그를 memory buffer에 누적
 * - flush 시점에 execution context를 결합하여 외부로 전달
 */
export class RSSObservationCollector {
  /**
   * retry 과정에서 수집된 observation 로그
   */
  private logs: PartialObservation[] = [];

  /**
   * observation 추가
   *
   * === 역할 ===
   * - fetch 과정 중 발생한 이벤트를 memory에 저장
   * - executionId / feedId 없이 raw 데이터만 보관
   */
  add(log: PartialObservation) {
    this.logs.push(log);
  }

  /**
   * observation flush
   *
   * === 역할 ===
   * - 누적된 로그를 외부 observer로 전달
   * - execution context (executionId, feedId)를 결합
   *
   * === 조건 ===
   * - observer가 존재해야 함
   * - context가 존재해야 함
   *
   * === 동작 ===
   * - logs 전체 순회
   * - 각 log에 context를 merge하여 observer 호출
   * - flush 완료 후 logs 초기화
   */
  flush(
    observer?: (log: FeedFetchObservationCreateDTO) => void,
    context?: {
      executionId: string;
      feedId: string;
    },
  ) {
    /**
     * observer 또는 context가 없으면 flush 수행하지 않음
     */
    if (!observer || !context) return;

    /**
     * 누적된 observation을 외부로 전달
     */
    for (const log of this.logs) {
      observer({
        ...log,
        executionId: context.executionId,
        feedId: context.feedId,
      });
    }

    /**
     * flush 완료 후 메모리 초기화
     */
    this.logs = [];
  }
}
