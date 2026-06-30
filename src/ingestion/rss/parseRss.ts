import { XMLParser } from "fast-xml-parser";
import { XMLNode } from "./types";
import { createDescriptionFromContent } from "./helpers/createDescriptionFromContent";
import { getString } from "./helpers/getString";
import { FeedItemInput } from "@/features/feed-sample/types";
import { Logger } from "pino";

/**
 * RSS/Atom XML → normalized RSSItem[]
 *
 * === 역할 ===
 * 서로 다른 RSS 구조를 하나의 표준 DTO로 변환
 *
 * === 처리 대상 ===
 * - RSS 2.0: rss.channel.item
 * - Atom: feed.entry
 *
 * === 핵심 ===
 * "파싱 이후에는 구조를 무조건 동일하게 만든다"
 */
export function parseRSS(xml: string, logger: Logger): FeedItemInput[] {
  logger?.debug(
    {
      xmlLength: xml?.length ?? 0,
    },
    "rss.parse.start",
  );
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const data = parser.parse(xml);

  const items = data?.rss?.channel?.item || data?.feed?.entry || [];

  // 단일 object → array 강제 변환 (RSS edge case 대응)
  const normalized = Array.isArray(items) ? items : [items];

  logger?.debug(
    {
      rawCount: Array.isArray(items) ? items.length : 1,
      normalizedCount: normalized.length,
    },
    "rss.parse.items",
  );

  try {
    const result = normalized.map((item: XMLNode): FeedItemInput => {
      const guid = (item.guid as XMLNode)?.["#text"] ?? item.guid ?? item.id;

      const rawContent =
        getString((item as XMLNode)["content:encoded"]) ??
        getString((item.content as XMLNode)?.["#text"]) ??
        getString(item.content) ??
        null;

      const description =
        getString(item.description) ??
        getString(item.summary) ??
        createDescriptionFromContent(rawContent) ??
        "";

      return {
        guid: typeof guid === "string" ? guid : null,

        link:
          getString((item.link as XMLNode)?.["@_href"]) ??
          getString(item.link) ??
          "",

        title: getString(item.title) ?? "",

        description,

        author:
          getString((item.author as XMLNode)?.name) ??
          getString(item.author) ??
          null,

        publishedAt: getString(item.pubDate)
          ? new Date(getString(item.pubDate) as string)
          : getString(item.published)
            ? new Date(getString(item.published) as string)
            : null,

        categories: Array.isArray(item.category)
          ? (item.category as string[])
          : item.category
            ? [item.category as string]
            : [],
      };
    });

    logger?.info(
      {
        resultCount: result.length,
      },
      "rss.parse.success",
    );

    return result;
  } catch (err) {
    logger?.error(
      {
        err,
      },
      "rss.parse.error",
    );

    throw err;
  }
}
