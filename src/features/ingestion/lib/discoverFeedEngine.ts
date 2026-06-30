"use server";

import { fetchDynamicSite, fetchSite } from "../lib/fetch-utils";
import { discoverParseRss } from "./discover/parser/discover-rss-parser";
import { rssDetector } from "../lib/detectors/rss-detector";
import { HTML_SITE_TYPE, SOURCE_TYPE } from "../lib/detectors/types";
import { htmlSiteDetector } from "../lib/detectors/html-site-detector";
import { FEED_HEADERS } from "../constants/feed";
import { detectListingPages } from "../lib/discover/detectListingPages";
import { createTraceId } from "../logger/trace-id";
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
import { robotsDetector } from "./detectors/RobotsDetector";
import { discoverLogger } from "../logger/pipelines";

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
  // =========================
  // [TRACE / LOGGING INIT]
  // =========================
  /**
   * Discover 실행 단위 Logger
   *
   * 하나의 Discover 실행 전체를 추적하기 위한 Logger이다.
   * 모든 하위 Logger는 이 Run Logger를 부모로 생성된다.
   */
  const traceId = createTraceId();
  const runLogger = discoverLogger.child({
    traceId,
  });

  let stage = "init";

  try {
    // =========================
    // [1. 사이트 HTML fetch]
    // =========================
    stage = "fetch.site";
    const res = await fetchSite(targetUrl, runLogger);

    if (!res) {
      stage = "fetch.site.empty";
      return {
        success: false,
        message: "사이트에 연결할 수 없습니다.",
      };
    }

    const { finalUrl, dom, html } = res;

    // =========================
    // [2. Site 기본 정보 추출 + pending 저장]
    // =========================
    stage = "extract.site.info";

    const siteInfo = extractSiteInfo(html, finalUrl);
    const site = await siteService.createPending(finalUrl, siteInfo);

    /**
     * Site Logger 생성
     *
     * Discover 중 생성된 Site를 기준으로
     * 이후 로그를 Site Context와 함께 기록한다.
     */
    const siteLogger = runLogger.child({
      siteId: site._id.toString(),
    });

    siteLogger.debug("site.create.pending");

    // =========================
    // [3. RSS 탐지]
    // =========================

    stage = "detect.rss";

    const rssResult = await rssDetector.detect(dom, finalUrl, siteLogger);

    if (rssResult?.type === SOURCE_TYPE.RSS) {
      // =========================
      // [1. RSS URL 발견됨]
      // =========================
      // 사이트에서 RSS 링크를 직접 탐지한 경우
      // 이후 HTML 크롤링 대신 RSS 파싱으로 즉시 전환\
      stage = "rss.parse";

      const rssFeed = await discoverParseRss(rssResult.rssUrl, siteLogger);

      // =========================
      // [2. RSS 원본 데이터 → 내부 표준 구조 변환]
      // =========================
      // discoverParseRss 결과는 외부 RSS 구조(xml 기반 파싱 결과)라서
      // 프로젝트 내부에서 사용하는 FeedItemInput 구조와 다를 수 있음
      //
      // → 그래서 "표준화(normalization)" 단계 필요
      stage = "rss.normalize";
      const normalizedFeed = normalizeToRssInput(rssFeed);

      // =========================
      // [3. FeedItemInput 형태로 최종 변환]
      // =========================
      // RSS 표준 → 내부 크롤러/샘플 시스템에서 사용하는 형태로 변환
      // (title, link, publishedAt 등 구조 통일)
      stage = "rss.extract";
      const items = extractRssItems(normalizedFeed, 5, siteLogger);

      // =========================
      // [4. RSS 샘플 저장]
      // =========================
      // RSS는 이미 구조화된 데이터라 crawler보다 안정적
      // → feed sample로 즉시 저장
      stage = "rss.persist";
      await feedSampleService.createRssSamples(site._id, items);

      // =========================
      // [5. Site + Feed 상태 업데이트]
      // =========================
      // RSS 발견 시 상태를 "rss"로 고정
      // + RSS feed URL 저장

      await siteService.updateFeedStatus(site._id, SITE_FEED_STATUS.RSS);

      stage = "rss.finalize";
      const feed = await feedService.createRssFeed(
        site._id,
        rssResult.rssUrl,
        site.name,
      );

      if (!feed) {
        siteLogger.warn(
          {
            stage: "rss.finalize",
            rssUrl: rssResult.rssUrl,
            siteId: site._id,
          },
          "discover.rss.feed.create.failed",
        );

        return {
          success: false,
          message: "피드 생성 실패",
        };
      }

      /**
       * Feed Logger 생성
       *
       * 생성된 Feed를 기준으로
       * 이후 Feed 관련 로그를 기록한다.
       */
      const feedLogger = siteLogger.child({
        feedId: feed.id,
      });

      feedLogger.info(
        {
          rssUrl: rssResult.rssUrl,
          siteId: site._id,
        },
        "discover.rss.feed.created",
      );

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
    // [4. robots.txt 확인]
    // =========================
    stage = "robots.check";
    const robotsAllowed = await robotsDetector.detect(targetUrl, siteLogger);

    if (!robotsAllowed) {
      stage = "robots.blocked";

      await siteService.updateFeedStatus(site._id, "unavailable");

      return {
        success: true,
        site: {
          ...site,
          feedStatus: SITE_FEED_STATUS.UNAVAILABLE,
        },
        message: "robots.txt에 의해 크롤링이 차단된 사이트입니다.",
      };
    }

    // =========================
    // [5. HTML 타입 판별]
    // =========================
    stage = "detect.html.type";
    const htmlType = await htmlSiteDetector.detect(dom, siteLogger);

    // =========================
    // [6. 동적 사이트 재fetch (Puppeteer)]
    // =========================
    let fetchResult = res;

    if (htmlType === HTML_SITE_TYPE.DYNAMIC) {
      stage = "fetch.dynamic";
      fetchResult = (await fetchDynamicSite(targetUrl, siteLogger)) ?? res;
    }

    const baseUrl = fetchResult.finalUrl;

    // =========================
    // [7. 목록 페이지 탐지]
    // =========================
    stage = "detect.listing";

    const { candidates } = await detectListingPages(
      baseUrl,
      fetchResult.dom,
      FEED_HEADERS,
      5,
      siteLogger,
    );

    // =========================
    // [8. 후보 처리 (crawl feed 생성)]
    // =========================
    if (candidates.length > 0) {
      stage = "crawl.persist";

      await siteService.updateFeedStatus(site._id, "crawlable");

      const puppeteer =
        htmlType === HTML_SITE_TYPE.DYNAMIC ? await import("puppeteer") : null;

      for (const c of candidates) {
        if (!c.listingPageConfig) continue;

        siteLogger.info(
          {
            stage: "crawl.persist",
            candidateUrl: c.url,
          },
          "discover.crawl.candidate.start",
        );

        let items: FeedItemInput[] = [];

        // STATIC 추출
        if (htmlType === HTML_SITE_TYPE.STATIC) {
          items = extractCrawlerItems(
            fetchResult.html,
            c.listingPageConfig,
            baseUrl,
            siteLogger,
            undefined,
            5,
          );

          siteLogger.info(
            {
              candidateUrl: c.url,
              itemCount: items.length,
            },
            "discover.crawl.items.static",
          );
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
              baseUrl,
              siteLogger,
              5,
            );

            siteLogger.info(
              {
                candidateUrl: c.url,
                itemCount: items.length,
              },
              "discover.crawl.items.dynamic",
            );
          } finally {
            await page.close();
            await browser.close();
          }
        }

        // empty skip
        if (items.length === 0) {
          siteLogger.debug(
            {
              candidateUrl: c.url,
            },
            "discover.crawl.items.empty",
          );
          continue;
        }

        const feed = await feedService.createCrawlFeed(
          site._id,
          c.title,
          c.url,
          c.listingPageConfig,
          c.detailPageConfig,
          htmlType,
        );

        if (!feed) {
          siteLogger.error(
            {
              candidateUrl: c.url,
            },
            "discover.crawl.feed.create.failed",
          );

          return {
            success: false,
            message: "피드 생성 실패",
          };
        }

        siteLogger.info(
          {
            candidateUrl: c.url,
            feedId: feed.id,
          },
          "discover.crawl.feed.created",
        );

        /**
         * Feed Logger 생성
         *
         * 생성된 Feed를 기준으로
         * 이후 Feed 관련 로그를 기록한다.
         */
        const feedLogger = siteLogger.child({
          feedId: feed.id,
        });

        const feedId = feed?.id;
        if (!feedId) {
          feedLogger.warn("discover.feed.missing_id");
          continue;
        }

        feedLogger.debug(
          {
            feedId,
          },
          "discover.feed.sample.start",
        );

        await feedSampleService.createCrawlerSamples(feedId, items);

        feedLogger.info(
          {
            feedId,
            itemCount: items.length,
          },
          "discover.feed.sample.created",
        );
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
    // [9. 실패 처리]
    // =========================
    stage = "final.unavailable";

    await siteService.updateFeedStatus(site._id, "unavailable");

    return {
      success: true,
      site: {
        ...site,
        feedStatus: SITE_FEED_STATUS.UNAVAILABLE,
      },
      message: "구독 가능한 페이지를 찾지 못했습니다.",
    };
  } catch (err) {
    runLogger.error({ err, stage }, "discover failed");

    return {
      success: false,
      message: "분석 중 오류가 발생했습니다.",
    };
  }
}
