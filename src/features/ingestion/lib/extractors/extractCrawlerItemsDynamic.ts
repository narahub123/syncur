import { Page } from "puppeteer";
import { ListingPageConfig, FieldExtractor } from "../discover/types";
import { FeedItemInput } from "@/features/feed-sample/types";

/**
 * Puppeteer DOM → FeedItemInput[] 변환
 *
 * @description
 * 브라우저 환경(Puppeteer page.evaluate)에서 실행되며,
 * 실제 렌더링된 DOM을 기반으로 목록 페이지 데이터를 추출한다.
 *
 * Cheerio 기반 extractCrawlerItems와 동일한 역할을 하지만,
 * JavaScript 실행이 필요한 SPA / dynamic site 대응용 extractor이다.
 */
export async function extractCrawlerItemsDynamic(
  page: Page,
  config: ListingPageConfig,
  limit: number = 5,
): Promise<FeedItemInput[]> {
  // =========================
  // [1. 브라우저 컨텍스트 실행]
  // =========================
  // page.evaluate 내부 코드는 Node.js가 아니라 브라우저에서 실행됨
  const result = await page.evaluate(
    (cfg, max) => {
      const items: FeedItemInput[] = [];

      // =========================
      // [2. item 단위 DOM 선택]
      // =========================
      const nodes = document.querySelectorAll(cfg.itemSelector);

      // =========================
      // [3. 반복 기반 추출]
      // =========================
      for (let i = 0; i < nodes.length && items.length < max; i++) {
        const el = nodes[i];

        // =========================
        // [4. title 추출]
        // =========================
        const title = (() => {
          const f = cfg.fields.title;
          const target = el.querySelector(f.selector);
          if (!target) return undefined;

          return f.extract === "text"
            ? (target.textContent?.trim() ?? undefined)
            : f.attr
              ? (target.getAttribute(f.attr) ?? undefined)
              : undefined;
        })();

        // =========================
        // [5. link 추출]
        // =========================
        const link = (() => {
          const f = cfg.fields.link;
          const target = el.querySelector(f.selector);
          if (!target) return undefined;

          return f.extract === "text"
            ? (target.textContent?.trim() ?? undefined)
            : f.attr
              ? (target.getAttribute(f.attr) ?? undefined)
              : undefined;
        })();

        // =========================
        // [6. publishedAt 추출 (optional)]
        // =========================
        const publishedAt = cfg.fields.publishedAt
          ? (() => {
              const f = cfg.fields.publishedAt;
              const target = el.querySelector(f.selector);
              if (!target) return undefined;

              return f.extract === "text"
                ? (target.textContent?.trim() ?? undefined)
                : f.attr
                  ? (target.getAttribute(f.attr) ?? undefined)
                  : undefined;
            })()
          : undefined;

        // =========================
        // [7. validation]
        // =========================
        // 핵심 필드 누락 시 skip
        if (!link || !title) continue;

        // =========================
        // [8. FeedItem 생성]
        // =========================
        items.push({
          link,
          title,
          publishedAt,
          categories: [],
        });
      }

      // =========================
      // [9. 결과 반환]
      // =========================
      return items;
    },
    config,
    limit,
  );

  return result;
}
