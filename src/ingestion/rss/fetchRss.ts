import axios from "axios";
import { RSS_CONFIG } from "./rss-config";
import { FeedLean } from "@/features/feeds/types/leans";

/**
 * retry 가능한 에러인지 판단
 */
function isRetryableError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return true;

  const code = err.code as string | undefined;
  const status = err.response?.status;

  if (
    code &&
    (RSS_CONFIG.RETRYABLE_ERRORS as readonly string[]).includes(code)
  ) {
    return true;
  }

  if (status && status >= 500) {
    return true;
  }

  return false;
}

/**
 * sleep util (exponential backoff)
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * RSS Fetch Result Type
 *
 * === 역할 ===
 * fetchRSS는 "데이터 + 캐시 메타"를 모두 반환한다
 *
 * === 이유 ===
 * - side-effect (feed mutation) 제거
 * - ingestion layer에서 DB 업데이트 책임 분리
 * - testability 증가
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
 * RSS Fetch Layer (retry + caching + timeout)
 *
 * === 역할 ===
 * - RSS XML 요청
 * - retry / backoff 처리
 * - HTTP 캐싱 (ETag / Last-Modified)
 * - 304 Not Modified 처리
 *
 * === 캐싱 전략 ===
 * - If-None-Match → ETag 기반
 * - If-Modified-Since → Last-Modified 기반
 * - 304 → 데이터 변경 없음 → ingestion skip
 */
export async function fetchRSS(feed: FeedLean): Promise<FetchRSSResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt < RSS_CONFIG.MAX_RETRY_COUNT; attempt++) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, RSS_CONFIG.RSS_FETCH_TIMEOUT);

    try {
      /**
       * HTTP Request with caching headers
       */
      const res = await axios.get(feed.feedUrl, {
        signal: controller.signal,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 304,
        headers: {
          "User-Agent": RSS_CONFIG.RSS_USER_AGENT,
          Accept: RSS_CONFIG.RSS_ACCEPT,

          /**
           * Conditional Request Headers
           *
           * - 이전 fetch 결과 기반으로 서버에 변경 여부 확인
           */
          ...(feed.etag && {
            "If-None-Match": feed.etag,
          }),
          ...(feed.lastModified && {
            "If-Modified-Since": feed.lastModified,
          }),
        },
      });

      /**
       * 304 Not Modified
       *
       * === 의미 ===
       * RSS 내용 변경 없음 → parsing / DB 작업 모두 skip 가능
       */
      if (res.status === 304) {
        return {
          type: "NOT_MODIFIED",
        };
      }

      /**
       * 캐시 메타 추출
       *
       * - ingestion layer에서 DB 저장 책임
       */
      const etag = res.headers["etag"];
      const lastModified = res.headers["last-modified"];

      return {
        type: "OK",
        xml: res.data,
        etag,
        lastModified,
      };
    } catch (err: unknown) {
      lastError = err;

      /**
       * retry 불가능한 에러는 즉시 종료
       */
      if (!isRetryableError(err)) {
        break;
      }

      /**
       * 마지막 retry면 종료
       */
      if (attempt === RSS_CONFIG.MAX_RETRY_COUNT - 1) {
        break;
      }

      /**
       * exponential backoff
       *
       * - 요청 간격 증가 → RSS 서버 보호
       */
      const delay = RSS_CONFIG.RETRY_BACKOFF_BASE_MS * Math.pow(2, attempt);

      await sleep(delay);
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * 에러 표준화
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
