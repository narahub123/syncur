import * as cheerio from "cheerio";
import { ListingPageConfig, FieldExtractor } from "../discover/types";
import { FeedItemInput } from "@/features/feed-sample/types";
import { Logger } from "pino";

export function extractCrawlerItems(
  html: string,
  config: ListingPageConfig,
  baseUrl: string,
  logger: Logger,
  lastSeenUrl?: string, // 추가
  limit?: number,
): FeedItemInput[] {
  const $ = cheerio.load(html);
  const items: FeedItemInput[] = [];

  logger?.debug(
    {
      selector: config.itemSelector,
      limit,
      hasLastSeenUrl: !!lastSeenUrl,
    },
    "crawler.extract.start",
  );

  const elements = $(config.itemSelector);

  elements.each((_, el) => {
    if (limit !== undefined && items.length >= limit) return;

    const resolveField = (field: FieldExtractor) => {
      const target = $(el).find(field.selector);
      if (!target.length) return undefined;

      if (field.extract === "text") return target.text()?.trim();
      if (field.extract === "attr") {
        if (!field.attr) return undefined;
        return target.attr(field.attr);
      }

      return undefined;
    };

    const linkRaw = resolveField(config.fields.link);
    const link = linkRaw ? new URL(linkRaw, baseUrl).href : undefined;
    const title = resolveField(config.fields.title);
    const publishedAt = config.fields.publishedAt
      ? resolveField(config.fields.publishedAt)
      : undefined;

    if (!link || !title) return;

    /**
     * lastSeenUrl 이후는 이미 본 글 → 중단
     */

    if (lastSeenUrl && link === lastSeenUrl) {
      logger?.debug({ lastSeenUrl, current: link }, "crawler.extract.cutoff");
      return false; // cheerio each에서 false = break
    }

    items.push({ link, title, publishedAt, categories: [] });
  });

  logger?.debug(
    {
      count: items.length,
    },
    "crawler.extract.done",
  );

  return items;
}
