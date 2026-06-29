import { Page } from "puppeteer";
import { ListingPageConfig } from "../discover/types";
import { FeedItemInput } from "@/features/feed-sample/types";

export async function extractCrawlerItemsDynamic(
  page: Page,
  config: ListingPageConfig,
  baseUrl: string,
  limit?: number,
): Promise<FeedItemInput[]> {
  const result = await page.evaluate(
    (cfg, max) => {
      const items: Array<{
        link: string | undefined;
        title: string | undefined;
        publishedAt: string | undefined;
        categories: never[];
      }> = [];

      const nodes = document.querySelectorAll(cfg.itemSelector);

      for (let i = 0; i < nodes.length; i++) {
        if (max !== undefined && items.length >= max) break;

        const el = nodes[i];

        const extractField = (f: {
          selector: string;
          extract: string;
          attr?: string;
        }) => {
          const target = el.querySelector(f.selector);
          if (!target) return undefined;
          return f.extract === "text"
            ? (target.textContent?.trim() ?? undefined)
            : f.attr
              ? (target.getAttribute(f.attr) ?? undefined)
              : undefined;
        };

        const title = extractField(cfg.fields.title);
        const linkRaw = extractField(cfg.fields.link);
        const publishedAt = cfg.fields.publishedAt
          ? extractField(cfg.fields.publishedAt)
          : undefined;

        if (!linkRaw || !title) continue;

        items.push({ link: linkRaw, title, publishedAt, categories: [] });
      }

      return items;
    },
    config,
    limit,
  );

  // page.evaluate는 브라우저 컨텍스트라 URL 변환 불가 → Node.js에서 처리
  return result.map((item) => ({
    ...item,
    link: item.link ? new URL(item.link, baseUrl).href : item.link,
  })) as FeedItemInput[];
}
