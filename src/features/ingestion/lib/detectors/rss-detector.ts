import { FEED_HEADERS } from "@/features/ingestion/constants/feed";
import { SourceDetector, DetectionResult, SOURCE_TYPE } from "./types";
import {
  RSS_CONTENT_TYPES,
  RSS_FALLBACK_PATHS,
  RSS_LINK_SELECTORS,
} from "./constants";
import { validateFeeds } from "./validateFeeds";
import { detectCmsFeed } from "../strategies/detectCmsFeed";
import { extractMetaFeed } from "../strategies/extractMetaFeed";

/**
 * RSS/Atom/JSON Feed URL 탐색
 *
 * 탐색 전략 (우선순위 순):
 * 1. HTML link 태그 기반 추출
 * 2. 표준 경로 fallback (/rss, /feed ...)
 * 3. CMS 휴리스틱 (WordPress, Medium, Ghost 등)
 * 4. 메타데이터 fallback (JSON-LD 등)
 */
export const rssDetector: SourceDetector = {
  async detect(dom, url, logger): Promise<DetectionResult | null> {
    // ── 1. HTML link 태그 기반 추출 ─────────────────────────
    for (const selector of RSS_LINK_SELECTORS) {
      logger.debug({ selector }, "rss.detect.link.scan");

      const href = dom(selector).attr("href");

      if (href) {
        const rssUrl = new URL(href, url).href;
        logger.info({ selector, href, rssUrl }, "rss.detect.link.found");
        return { type: SOURCE_TYPE.RSS, rssUrl };
      }
    }

    // ── 2. 표준 경로 fallback ────────────────────────────────
    logger.info(
      { baseUrl: url, paths: RSS_FALLBACK_PATHS },
      "rss.detect.fallback.start",
    );

    for (const path of RSS_FALLBACK_PATHS) {
      const candidateUrl = new URL(path, url).href;

      logger.debug({ path, candidateUrl }, "rss.detect.fallback.scan");

      try {
        const headRes = await fetch(candidateUrl, {
          method: "HEAD",
          headers: FEED_HEADERS,
        });

        logger.debug(
          { candidateUrl, ok: headRes.ok, status: headRes.status },
          "rss.detect.fallback.head",
        );

        if (!headRes.ok) continue;

        const getRes = await fetch(candidateUrl, { headers: FEED_HEADERS });

        logger.debug(
          { candidateUrl, ok: getRes.ok },
          "rss.detect.fallback.get",
        );

        if (!getRes.ok) continue;

        const contentType = getRes.headers.get("content-type") ?? "";
        const isFeed = RSS_CONTENT_TYPES.some((type) =>
          contentType.includes(type),
        );

        if (!isFeed) {
          logger.debug(
            { candidateUrl, contentType, expected: RSS_CONTENT_TYPES },
            "rss.detect.fallback.invalid",
          );
          continue;
        }

        logger.info({ rssUrl: candidateUrl }, "rss.detect.fallback.found");

        return { type: SOURCE_TYPE.RSS, rssUrl: candidateUrl };
      } catch (error) {
        logger.warn({ candidateUrl, err: error }, "rss.detect.fallback.error");
        continue;
      }
    }

    // ── 3. CMS 휴리스틱 ─────────────────────────────────────
    // HTML 문자열이 필요하므로 dom.html()로 추출
    const html = dom.html() ?? "";

    logger.debug({}, "rss.detect.cms.start");

    const cmsFeeds = detectCmsFeed(url, html);

    if (cmsFeeds.length > 0) {
      const result = await validateFeeds(cmsFeeds, logger);
      if (result) {
        logger.info({ rssUrl: result }, "rss.detect.cms.found");

        return { type: SOURCE_TYPE.RSS, rssUrl: result };
      }
    }

    // ── 4. 메타데이터 fallback ───────────────────────────────
    logger.debug("메타데이터 fallback 탐색 시작");
    const metaFeeds = extractMetaFeed(html);

    if (metaFeeds.length > 0) {
      const result = await validateFeeds(metaFeeds, logger);
      if (result) {
        logger.info({ rssUrl: result }, "rss.detect.meta.found");
        return { type: SOURCE_TYPE.RSS, rssUrl: result };
      }
    }

    // 모든 전략 실패
    logger.info({}, "rss.detect.not_found");
    return null;
  },
};
