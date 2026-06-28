import { parseAndNormalizeFeed } from "@/features/rss/parser/parseFeed";
import { normalizeError } from "../../logger/normalizeError";
import { FEED_HEADERS } from "../../constants/feed";
import { Logger } from "../../logger/types";

/**
 * RSS 후보 URL 목록을 검증해서 유효한 첫 번째 URL 반환
 * discoverSite의 validateAndScore에서 가져옴
 */
export async function validateFeeds(
  feedUrls: string[],
  logger: Logger,
): Promise<string | null> {
  const results = await Promise.all(
    feedUrls.map(async (url) => {
      try {
        const res = await fetch(url, { headers: FEED_HEADERS });
        const text = await res.text();

        const trimmed = text.trim();
        const looksLikeFeed =
          trimmed.startsWith("<?xml") ||
          trimmed.includes("<rss") ||
          trimmed.includes("<feed");

        if (!looksLikeFeed) return null;

        const feed = await parseAndNormalizeFeed(text);
        if (!feed) return null;

        return url;
      } catch (error) {
        logger.warn("RSS 후보 검증 실패", {
          url,
          error: normalizeError(error),
        });
        return null;
      }
    }),
  );

  return results.find(Boolean) ?? null;
}
