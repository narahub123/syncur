import axios from "axios";
import { FeedLean } from "@/features/feeds/types/leans";
import { RSS_CONFIG } from "./rss-config";

import { executeRSSRequest } from "./executeRSSRequest";
import { RSSObservationCollector } from "./rss-observation/RSSObservationCollector";
import { isRetryableError, sleep } from "./rss-policy/isRetryableError";
import { FeedFetchObservationCreateDTO } from "@/features/feed-fetch-observation/dtos/feedFetchObservationDTO";

/**
 * RSS Fetch Result (❗ 반환 계약 고정)
 *
 * === 중요 ===
 * - 외부 ingestion / parser / persistence가 의존하는 계약이므로 변경 금지
 */
export type FetchRSSResult =
  | {
      type: "OK";
      xml: string;
      etag?: string;
      lastModified?: string;
    }
  | {
      type: "NOT_MODIFIED";
    };

/**
 * RSS Fetch Orchestrator
 *
 * === 역할 ===
 * - HTTP 요청 실행 (executeRSSRequest)
 * - retry / backoff 정책 적용
 * - timeout 제어
 * - observation 수집 (collector)
 * - 외부 observer로 flush 전달
 *
 * === 핵심 원칙 ===
 * - fetchRSS는 DB를 몰라야 한다
 * - observer만 호출한다
 * - context(feedId, executionId)는 fetchRSS가 주입한다
 */
export async function fetchRSS(
  feed: FeedLean,
  executionId: string,
  observer?: (log: FeedFetchObservationCreateDTO) => void,
) {
  /**
   * RSS fetch 시작 (실행 단위 메타 정보)
   * - feed: 대상 RSS feed
   * - executionId: 실행 단위 식별자
   */
  const collector = new RSSObservationCollector();

  let lastError: unknown;
  let result: FetchRSSResult | null = null;

  try {
    /**
     * =========================
     * RETRY LOOP
     * =========================
     * - MAX_RETRY_COUNT 만큼 재시도
     * - 네트워크/일시적 오류 대응
     */
    for (let attempt = 0; attempt < RSS_CONFIG.MAX_RETRY_COUNT; attempt++) {
      const start = Date.now();
      const controller = new AbortController();

      /**
       * 요청 timeout 설정
       * - 일정 시간 초과 시 abort
       */
      const timeout = setTimeout(() => {
        controller.abort();
      }, RSS_CONFIG.RSS_FETCH_TIMEOUT);

      try {
        /**
         * =========================
         * HTTP REQUEST EXECUTION
         * =========================
         * RSS feed 실제 요청 수행
         */
        const res = await executeRSSRequest({
          url: feed.feedUrl!,
          timeout: RSS_CONFIG.RSS_FETCH_TIMEOUT,
          signal: controller.signal,
          headers: {
            "User-Agent": RSS_CONFIG.RSS_USER_AGENT,
            Accept: RSS_CONFIG.RSS_ACCEPT,
            ...(feed.etag && { "If-None-Match": feed.etag }),
            ...(feed.lastModified && {
              "If-Modified-Since": feed.lastModified,
            }),
          },
        });

        const end = Date.now();

        /**
         * 성공 observation 기록
         */
        collector.add({
          attempt,
          feedUrl: feed.feedUrl!,
          startTime: start,
          endTime: end,
          durationMs: end - start,
          success: true,
        });

        /**
         * 304 Not Modified 처리
         */
        if (res.status === 304) {
          result = { type: "NOT_MODIFIED" };
          break;
        }

        /**
         * 정상 응답 반환값 구성
         */
        result = {
          type: "OK",
          xml: res.data,
          etag: res.headers["etag"],
          lastModified: res.headers["last-modified"],
        };

        break;
      } catch (err) {
        const end = Date.now();

        /**
         * 실패 observation 기록
         */
        lastError = err;

        collector.add({
          attempt,
          feedUrl: feed.feedUrl!,
          startTime: start,
          endTime: end,
          durationMs: end - start,
          success: false,
          errorCode: axios.isAxiosError(err) ? err.code : "UNKNOWN",
          errorMessage: err instanceof Error ? err.message : String(err),
        });

        /**
         * retry 불가능한 경우 즉시 종료
         */
        if (!isRetryableError(err)) break;

        /**
         * 마지막 retry면 종료
         */
        if (attempt === RSS_CONFIG.MAX_RETRY_COUNT - 1) break;

        /**
         * exponential backoff delay
         */
        const delay = RSS_CONFIG.RETRY_BACKOFF_BASE_MS * Math.pow(2, attempt);

        await sleep(delay);
      } finally {
        /**
         * timeout 정리
         */
        clearTimeout(timeout);
      }
    }
  } finally {
    /**
     * =========================
     * OBSERVATION FLUSH
     * =========================
     * - retry 과정에서 모은 로그를 외부로 전달
     * - 반드시 executionId + feedId context 포함
     */
    collector.flush(
      (log) => {
        /**
         * 외부 observer로 전달되는 최종 log
         */
        observer?.({
          ...log,
          executionId,
          feedId: feed._id.toString(),
        });
      },
      {
        executionId,
        feedId: feed._id.toString(),
      },
    );
  }

  /**
   * =========================
   * RESULT RETURN
   * =========================
   */
  if (result) return result;

  /**
   * =========================
   * ERROR HANDLING
   * =========================
   */
  if (axios.isAxiosError(lastError)) {
    if (lastError.code === "ERR_CANCELED") {
      throw new Error(`RSS_FETCH_TIMEOUT: ${feed.feedUrl}`);
    }

    if (lastError.response) {
      throw new Error(
        `RSS_HTTP_ERROR_${lastError.response.status}: ${feed.feedUrl}`,
      );
    }

    if (lastError.code === "ENOTFOUND") {
      throw new Error(`RSS_DNS_ERROR: ${feed.feedUrl}`);
    }
  }

  throw new Error(`RSS_UNKNOWN_ERROR: ${feed.feedUrl}`);
}
