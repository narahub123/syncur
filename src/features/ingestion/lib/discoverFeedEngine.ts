"use server";

import { fetchDynamicSite, fetchSite } from "../lib/fetch-utils";
import { discoverParseRss } from "./discover/parser/discover-rss-parser";
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
import { extractRssItems } from "../lib/extractors/extractRssItems";
import { FeedItemInput } from "@/features/feed-sample/types";
import { extractCrawlerItems } from "../lib/extractors/extractCrawlerItems";
import { feedSampleService } from "@/features/feed-sample/service/FeedSampleService.instance";
import { normalizeToRssInput } from "../utils/normalizeToRssInput";
import { extractCrawlerItemsDynamic } from "../lib/extractors/extractCrawlerItemsDynamic";
import { SITE_FEED_STATUS } from "@/features/rss/site/constants/site";
import { SiteDto } from "@/features/rss/site/dto/siteDto";

/**
 * 피드 탐색 결과 인터페이스
 */
export interface DiscoveryResult {
  success: boolean;

  message: string;

  site?: SiteDto;
}

export async function discoverFeedEngine(
  targetUrl: string,
): Promise<DiscoveryResult> {
  try {
    // =========================
    // [TRACE / LOGGING INIT]
    // =========================
    const traceId = createTraceId();
    const logger: Logger = createLogger({ traceId });

    // // =========================
    // // [1. URL 정규화]
    // // =========================
    // const targetUrl = await withLogging(
    //   normalizeUrl,
    //   logger,
    //   INGESTION_STAGE.NORMALIZE_URL,
    // )(input, logger);

    // =========================
    // [3. 사이트 HTML fetch]
    // =========================
    const res = await withLogging(
      fetchSite,
      logger,
      INGESTION_STAGE.FETCH_SITE,
    )(targetUrl, logger);

    if (!res) {
      return {
        success: false,
        message: "사이트에 연결할 수 없습니다.",
      };
    }

    const { finalUrl, dom, html } = res;

    // =========================
    // [4. Site 기본 정보 추출 + pending 저장]
    // =========================
    const siteInfo = extractSiteInfo(html, finalUrl);
    const site = await siteService.createPending(finalUrl, siteInfo);

    // =========================
    // [5. RSS 탐지]
    // =========================
    const rssResult = await withLogging(
      rssDetector.detect,
      logger,
      INGESTION_STAGE.RSS_DISCOVER,
    )(dom, finalUrl, logger);

    if (rssResult?.type === SOURCE_TYPE.RSS) {
      // =========================
      // [1. RSS URL 발견됨]
      // =========================
      // 사이트에서 RSS 링크를 직접 탐지한 경우
      // 이후 HTML 크롤링 대신 RSS 파싱으로 즉시 전환

      const rssFeed = await withLogging(
        discoverParseRss,
        logger,
        INGESTION_STAGE.PARSE,
      )(rssResult.rssUrl, logger);

      // =========================
      // [2. RSS 원본 데이터 → 내부 표준 구조 변환]
      // =========================
      // discoverParseRss 결과는 외부 RSS 구조(xml 기반 파싱 결과)라서
      // 프로젝트 내부에서 사용하는 FeedItemInput 구조와 다를 수 있음
      //
      // → 그래서 "표준화(normalization)" 단계 필요

      const normalizedFeed = normalizeToRssInput(rssFeed);

      // =========================
      // [3. FeedItemInput 형태로 최종 변환]
      // =========================
      // RSS 표준 → 내부 크롤러/샘플 시스템에서 사용하는 형태로 변환
      // (title, link, publishedAt 등 구조 통일)

      const items = extractRssItems(normalizedFeed, 5, logger);

      // =========================
      // [4. RSS 샘플 저장]
      // =========================
      // RSS는 이미 구조화된 데이터라 crawler보다 안정적
      // → feed sample로 즉시 저장

      await feedSampleService.createRssSamples(site._id, items);

      // =========================
      // [5. Site + Feed 상태 업데이트]
      // =========================
      // RSS 발견 시 상태를 "rss"로 고정
      // + RSS feed URL 저장

      await Promise.all([
        siteService.updateFeedStatus(site._id, SITE_FEED_STATUS.RSS),
        feedService.createRssFeed(site._id, rssResult.rssUrl, site.name),
      ]);

      // =========================
      // [6. 즉시 종료 (RSS 우선 처리)]
      // =========================
      return {
        success: true,
        site: {
          ...site,
          feedStatus: SITE_FEED_STATUS.RSS,
        },
        message: "RSS 피드를 찾았습니다.",
      };
    }

    // =========================
    // [6. HTML 타입 판별]
    // =========================
    const htmlType = await withLogging(
      htmlSiteDetector.detect,
      logger,
      INGESTION_STAGE.HTML_SITE_DETECT,
    )(dom, logger);

    // =========================
    // [7. 동적 사이트 재fetch (Puppeteer)]
    // =========================
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

    // =========================
    // [8. 목록 페이지 탐지]
    // =========================
    const { candidates } = await withLogging(
      detectListingPages,
      logger,
      INGESTION_STAGE.LISTING_DETECT,
    )(baseUrl, fetchResult.dom, FEED_HEADERS, 5, logger);

    // =========================
    // [9. 후보 처리 (crawl feed 생성)]
    // =========================
    if (candidates.length > 0) {
      await siteService.updateFeedStatus(site._id, "crawlable");

      const puppeteer =
        htmlType === HTML_SITE_TYPE.DYNAMIC ? await import("puppeteer") : null;

      for (const c of candidates) {
        if (!c.listingPageConfig) continue;

        let items: FeedItemInput[] = [];

        // STATIC 추출
        if (htmlType === HTML_SITE_TYPE.STATIC) {
          items = extractCrawlerItems(
            fetchResult.html,
            c.listingPageConfig,
            baseUrl,
            5,
          );

          logger.info("crawler items 생성", {
            url: c.url,
            count: items.length,
          });
        }

        // DYNAMIC 추출
        if (htmlType === HTML_SITE_TYPE.DYNAMIC && puppeteer) {
          const browser = await puppeteer.launch({
            headless: true,
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
            ],
          });

          const page = await browser.newPage();

          try {
            await page.goto(c.url, {
              waitUntil: "domcontentloaded",
              timeout: 15000,
            });

            items = await extractCrawlerItemsDynamic(
              page,
              c.listingPageConfig,
              5,
            );

            logger.info("dynamic items 생성", {
              url: c.url,
              count: items.length,
            });
          } finally {
            await page.close();
            await browser.close();
          }
        }

        // empty skip
        if (items.length === 0) continue;

        const feed = await feedService.createCrawlFeed(
          site._id,
          c.title,
          c.url,
          c.listingPageConfig,
          c.detailPageConfig,
        );

        const feedId = feed?.id;
        if (!feedId) continue;

        await feedSampleService.createCrawlerSamples(feedId, items);
      }

      return {
        success: true,
        site: {
          ...site,
          feedStatus: SITE_FEED_STATUS.CRAWLABLE,
        },
        message: `${candidates.length}개의 구독 가능한 목록 페이지를 찾았습니다.`,
      };
    }

    // =========================
    // [10. 실패 처리]
    // =========================
    await siteService.updateFeedStatus(site._id, "unavailable");

    return {
      success: true,
      site: {
        ...site,
        feedStatus: SITE_FEED_STATUS.UNAVAILABLE,
      },
      message: "구독 가능한 페이지를 찾지 못했습니다.",
    };
  } catch (error) {
    console.error("Feed discovery error:", error);

    return {
      success: false,
      message: "분석 중 오류가 발생했습니다.",
    };
  }
}
