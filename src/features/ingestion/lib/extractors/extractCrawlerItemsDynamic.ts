import { Page } from "puppeteer";
import { ListingPageConfig } from "../discover/types";
import { FeedItemInput } from "@/features/feed-sample/types";
import { Logger } from "pino";

export async function extractCrawlerItemsDynamic(
  page: Page,
  config: ListingPageConfig,
  baseUrl: string,
  logger: Logger,
  limit?: number,
): Promise<FeedItemInput[]> {
  const items = await page.evaluate(
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

        items.push({
          link: linkRaw,
          title,
          publishedAt,
          categories: [],
        });
      }

      return items;
    },
    config,
    limit,
  );

  // ── node side logging ─────────────────────────────

  logger?.debug(
    {
      selector: config.itemSelector,
      limit,
    },
    "crawler.dynamic.extract.start",
  );

  logger?.debug(
    {
      rawCount: items.length,
    },
    "crawler.dynamic.extract.evaluated",
  );

  const normalized = items.map((item) => ({
    ...item,
    link: item.link ? new URL(item.link, baseUrl).href : item.link,
  }));

  logger?.debug(
    {
      count: normalized.length,
    },
    "crawler.dynamic.extract.done",
  );

  return normalized as FeedItemInput[];
}
