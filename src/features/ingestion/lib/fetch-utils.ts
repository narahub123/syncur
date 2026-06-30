import * as cheerio from "cheerio";
import { FEED_HEADERS } from "@/features/ingestion/constants/feed";
import { Logger } from "pino";

export interface FetchSiteResult {
  finalUrl: string;
  html: string;
  dom: cheerio.CheerioAPI;
}

/**
 * 주어진 URL의 HTML을 가져와 사이트 분석에 필요한 데이터를 생성합니다.
 *
 * @param {string} url - 분석할 사이트의 대상 URL
 * @returns {Promise<FetchSiteResult | null>}
 * 성공 시 최종 URL, HTML, Cheerio DOM 객체를 포함한 객체를 반환하며,
 * 연결 실패나 오류 발생 시 null을 반환합니다.
 */
export async function fetchSite(
  url: string,
  logger: Logger,
): Promise<FetchSiteResult | null> {
  try {
    logger.info({ url }, "fetch.start");

    const response = await fetch(url, {
      headers: FEED_HEADERS,
      // next: { revalidate: 3600 },
    });

    if (!response.ok) {
      logger.warn(
        {
          url,
          status: response.status,
        },
        "fetch.failed",
      );
      return null;
    }

    const html = await response.text();

    // Cheerio 로드 (JSDOM 대체)
    const dom = cheerio.load(html);

    if (response.url !== url) {
      logger.debug(
        {
          before: url,
          after: response.url,
        },
        "fetch.redirect",
      );
    }

    logger.info(
      {
        url,
      },
      "fetch.success",
    );

    return {
      dom,
      html,
      finalUrl: response.url,
    };
  } catch (err) {
    logger.error(
      {
        err,
        url,
      },
      "fetch.error",
    );
    return null;
  }
}

/**
 * Puppeteer를 사용해 동적 사이트(SPA)의 HTML을 가져옵니다.
 * JS 렌더링이 완료된 후 HTML을 추출합니다.
 *
 * @param {string} url - 분석할 사이트의 대상 URL
 * @param {Logger} logger
 * @returns {Promise<FetchSiteResult | null>}
 */
export async function fetchDynamicSite(
  url: string,
  logger: Logger,
): Promise<FetchSiteResult | null> {
  let browser = null;

  try {
    logger.info({ url }, "fetch.start");

    const puppeteer = await import("puppeteer");

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // 리소스 차단 (유지)
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (["image", "font", "media", "stylesheet"].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded", // ⭐ 변경 (핵심)
      timeout: 20000,
    });

    if (!response || !response.ok()) {
      logger.warn({ url, status: response?.status() }, "fetch.failed");
      return null;
    }

    // ⭐ 핵심: DOM 안정화 대기 (동적 렌더 대응)
    await new Promise((r) => setTimeout(r, 2000));

    // ⭐ 최소 리스트 기반 안정화 (있으면 바로 통과)
    try {
      await page.waitForSelector("a", { timeout: 3000 });
    } catch {
      // 링크 없는 사이트도 있으므로 무시
    }

    const finalUrl = page.url();
    const html = await page.content();
    const dom = cheerio.load(html);

    if (finalUrl !== url) {
      logger.debug({ before: url, after: finalUrl }, "fetch.redirect");
    }

    return { finalUrl, html, dom };
  } catch (error) {
    logger.error({ err: error, url }, "fetch.error");
    return null;
  } finally {
    if (browser) await browser.close();
  }
}
