import axios from "axios";
import { RSS_CONFIG } from "./rss-config";

/**
 * RSS XML fetch layer
 *
 * === 역할 ===
 * RSS URL → raw XML string 획득
 *
 * === 특징 ===
 * - AbortController 기반 timeout 처리
 * - HTTP header 표준화
 * - RSS 서버 안정성 고려
 */
export async function fetchRSS(feedUrl: string): Promise<string> {
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
    /**
     * Axios error classification
     * → ingestion layer에서 정책 처리 가능하도록 분류
     */
    if (axios.isAxiosError(err)) {
      if (err.code === "ERR_CANCELED") {
        throw new Error(`RSS_FETCH_TIMEOUT: ${feedUrl}`);
      }

      if (err.response) {
        throw new Error(`RSS_HTTP_ERROR_${err.response.status}: ${feedUrl}`);
      }

      if (err.code === "ENOTFOUND") {
        throw new Error(`RSS_DNS_ERROR: ${feedUrl}`);
      }
    }

    throw new Error(`RSS_UNKNOWN_ERROR: ${feedUrl}`);
  } finally {
    clearTimeout(timeout);
  }
}
