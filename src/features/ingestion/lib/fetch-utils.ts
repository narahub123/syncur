import * as cheerio from "cheerio";
import { FEED_HEADERS } from "@/features/ingestion/constants/feed";
import { Logger } from "../logger/types";
import { normalizeError } from "../logger/normalizeError";

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
    const response = await fetch(url, {
      headers: FEED_HEADERS,
      // next: { revalidate: 3600 },
    });

    if (!response.ok) {
      logger.warn("fetch 요청 실패", {
        url,
        status: response.status,
      });
      return null;
    }

    const html = await response.text();

    // Cheerio 로드 (JSDOM 대체)
    const dom = cheerio.load(html);

    if (response.url !== url) {
      logger.debug("리다이렉트", {
        before: url,
        after: response.url,
      });
    }

    return {
      dom,
      html,
      finalUrl: response.url,
    };
  } catch (error) {
    logger.error("fetch 요청 오류", {
      error: normalizeError(error),
    });
    console.error("HTML Fetch Error:", error);
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
    // 로컬 환경 기준 — 배포 시 puppeteer-core + @sparticuz/chromium으로 교체
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

    // fetchSite와 동일한 User-Agent 사용
    await page.setExtraHTTPHeaders({
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // 이미지/폰트/미디어는 불필요 — 차단해서 속도 향상
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
      waitUntil: "networkidle2", // 네트워크 요청이 안정화될 때까지 대기
      timeout: 15000,
    });

    if (!response || !response.ok()) {
      logger.warn("Puppeteer fetch 요청 실패", {
        url,
        status: response?.status(),
      });
      return null;
    }

    const finalUrl = page.url();
    const html = await page.content();
    const dom = cheerio.load(html);

    if (finalUrl !== url) {
      logger.debug("리다이렉트", {
        before: url,
        after: finalUrl,
      });
    }

    return { finalUrl, html, dom };
  } catch (error) {
    logger.error("Puppeteer fetch 오류", {
      error: normalizeError(error),
    });
    return null;
  } finally {
    if (browser) await browser.close();
  }
}
