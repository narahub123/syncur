"use server";

import { normalizeUrl } from "@/features/ingestion/utils/url";
import { fetchDynamicSite, fetchSite } from "../lib/fetch-utils";
import { parseRss } from "../lib/parsers/rss-parser";
import { rssDetector } from "../lib/detectors/rss-detector";
import { HTML_SITE_TYPE, SOURCE_TYPE } from "../lib/detectors/types";
import { htmlSiteDetector } from "../lib/detectors/html-site-detector";
import { FEED_HEADERS } from "../constants/feed";
import { detectListingPages } from "../lib/discover/detectListingPages";
import { createTraceId } from "../logger/trace-id";
import { createLogger } from "../logger/logger";
import { Logger } from "../logger/types";
import { withLogging } from "../logger/with-logging";
import { INGESTION_STAGE } from "../logger/stages";
import { extractSiteInfo } from "../lib/extractors/extractSiteInfo";
import { siteService } from "@/features/rss/site/service/SiteService.instance";
import { feedService } from "@/features/feeds/service/FeedService.instance";

/**
 * 피드 탐색 결과 인터페이스
 */
export interface DiscoveryResult {
  success: boolean;
  url: string;
  feedUrl: string | null;
  message?: string;
}

export async function discoverFeedAction(
  input: string,
): Promise<DiscoveryResult> {
  try {
    const traceId = createTraceId();
    const logger: Logger = createLogger({ traceId });

    const targetUrl = await withLogging(
      normalizeUrl,
      logger,
      INGESTION_STAGE.NORMALIZE_URL,
    )(input, logger);

    // ── 1. 이미 저장된 사이트인지 확인 ─────────────────────
    const existingSite = await siteService.findByUrl(targetUrl);

    if (existingSite) {
      switch (existingSite.feedStatus) {
        case "rss": {
          const feed = await feedService.findRssFeedBySiteId(existingSite._id);
          return {
            success: true,
            url: targetUrl,
            feedUrl: feed?.feedUrl ?? null,
            message: "RSS 피드를 찾았습니다.",
          };
        }
        case "crawlable": {
          const feeds = await feedService.findCrawlFeedsBySiteId(
            existingSite._id,
          );
          return {
            success: true,
            url: targetUrl,
            feedUrl: null,
            message: `${feeds.length}개의 구독 가능한 목록 페이지를 찾았습니다.`,
          };
        }
        case "unavailable":
          return {
            success: true,
            url: targetUrl,
            feedUrl: null,
            message: "구독 가능한 페이지를 찾지 못했습니다.",
          };
        case "pending":
          // 이전에 탐색이 중단된 경우 — 탐색 재시도
          logger.info("pending 상태 사이트 재탐색", { url: targetUrl });
          break;
      }
    }

    // ── 2. 사이트 HTML 가져오기 ──────────────────────────────
    const res = await withLogging(
      fetchSite,
      logger,
      INGESTION_STAGE.FETCH_SITE,
    )(targetUrl, logger);

    if (!res) {
      return {
        success: false,
        url: targetUrl,
        feedUrl: null,
        message: "사이트에 연결할 수 없습니다.",
      };
    }

    const { finalUrl, dom, html } = res;

    // ── 3. 사이트 기본 정보 추출 + Site 저장 (pending) ──────
    const siteInfo = extractSiteInfo(html, finalUrl);
    const site = await siteService.createPending(finalUrl, siteInfo);

    // ── 4. RSS 판별 ──────────────────────────────────────────
    const rssResult = await withLogging(
      rssDetector.detect,
      logger,
      INGESTION_STAGE.RSS_DISCOVER,
    )(dom, finalUrl, logger);

    if (rssResult?.type === SOURCE_TYPE.RSS) {
      await parseRss(rssResult.rssUrl);

      // Site feedStatus 업데이트 + Feed 저장
      await Promise.all([
        siteService.updateFeedStatus(site._id, "rss"),
        feedService.createRssFeed(site._id, rssResult.rssUrl),
      ]);

      return {
        success: true,
        url: targetUrl,
        feedUrl: rssResult.rssUrl,
        message: "RSS 피드를 찾았습니다.",
      };
    }

    // ── 5. HTML 타입 판별 ────────────────────────────────────
    const htmlType = await withLogging(
      htmlSiteDetector.detect,
      logger,
      INGESTION_STAGE.HTML_SITE_DETECT,
    )(dom, logger);

    // ── 6. 동적 사이트면 Puppeteer로 재fetch ────────────────
    let fetchResult = res;

    if (htmlType === HTML_SITE_TYPE.DYNAMIC) {
      fetchResult =
        (await withLogging(
          fetchDynamicSite,
          logger,
          INGESTION_STAGE.FETCH_DYNAMIC_SITE,
        )(targetUrl, logger)) ?? res;
    }

    const baseUrl = fetchResult.finalUrl;

    // ── 7. 목록 페이지 탐지 ─────────────────────────────────
    const { candidates } = await withLogging(
      detectListingPages,
      logger,
      INGESTION_STAGE.LISTING_DETECT,
    )(baseUrl, fetchResult.dom, FEED_HEADERS, 5, logger);

    if (candidates.length > 0) {
      // Site feedStatus 업데이트 + Feed 저장 (목록 페이지 수만큼)
      await siteService.updateFeedStatus(site._id, "crawlable");
      await Promise.all(
        candidates
          .filter((c) => c.listingPageConfig !== null)
          .map((c) =>
            feedService.createCrawlFeed(
              site._id,
              c.url,
              c.listingPageConfig!,
              c.detailPageConfig,
            ),
          ),
      );

      return {
        success: true,
        url: targetUrl,
        feedUrl: null,
        message: `${candidates.length}개의 구독 가능한 목록 페이지를 찾았습니다.`,
      };
    }

    // ── 8. 둘 다 실패 ────────────────────────────────────────
    await siteService.updateFeedStatus(site._id, "unavailable");

    return {
      success: true,
      url: targetUrl,
      feedUrl: null,
      message: "구독 가능한 페이지를 찾지 못했습니다.",
    };
  } catch (error) {
    console.error("Feed discovery error:", error);
    return {
      success: false,
      url: input,
      feedUrl: null,
      message: "분석 중 오류가 발생했습니다.",
    };
  }
}
