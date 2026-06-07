import axios from "axios";
import { RSS_CONFIG } from "./rss-config";

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
 * sleep util (backoff용)
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * RSS XML fetch layer (with retry/backoff)
 */
export async function fetchRSS(feedUrl: string): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt < RSS_CONFIG.MAX_RETRY_COUNT; attempt++) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, RSS_CONFIG.RSS_FETCH_TIMEOUT);

    try {
      const res = await axios.get(feedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": RSS_CONFIG.RSS_USER_AGENT,
          Accept: RSS_CONFIG.RSS_ACCEPT,
        },
      });

      return res.data;
    } catch (err: unknown) {
      lastError = err;

      // retry 불가능한 에러는 즉시 종료
      if (!isRetryableError(err)) {
        break;
      }

      // 마지막 시도면 break
      if (attempt === RSS_CONFIG.MAX_RETRY_COUNT - 1) {
        break;
      }

      // exponential backoff
      const delay = RSS_CONFIG.RETRY_BACKOFF_BASE_MS * Math.pow(2, attempt);

      await sleep(delay);
    } finally {
      clearTimeout(timeout);
    }
  }

  // 에러 표준화
  if (axios.isAxiosError(lastError)) {
    if (lastError.code === "ERR_CANCELED") {
      throw new Error(`RSS_FETCH_TIMEOUT: ${feedUrl}`);
    }

    if (lastError.response) {
      throw new Error(
        `RSS_HTTP_ERROR_${lastError.response.status}: ${feedUrl}`,
      );
    }

    if (lastError.code === "ENOTFOUND") {
      throw new Error(`RSS_DNS_ERROR: ${feedUrl}`);
    }
  }

  throw new Error(`RSS_UNKNOWN_ERROR: ${feedUrl}`);
}
