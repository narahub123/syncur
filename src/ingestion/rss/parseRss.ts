import { XMLParser } from "fast-xml-parser";
import { RSSItem, XMLNode } from "./types";
import { createDescriptionFromContent } from "./helpers/createDescriptionFromContent";
import { getString } from "./helpers/getString";

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
export function parseRSS(xml: string): RSSItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const data = parser.parse(xml);

  const items = data?.rss?.channel?.item || data?.feed?.entry || [];

  // 단일 object → array 강제 변환 (RSS edge case 대응)
  const normalized = Array.isArray(items) ? items : [items];

  return normalized.map((item: XMLNode): RSSItem => {
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

      /**
       * publishedAt 정규화
       * RSS: pubDate
       * Atom: published
       */
      publishedAt: getString(item.pubDate)
        ? new Date(getString(item.pubDate) as string)
        : getString(item.published)
          ? new Date(getString(item.published) as string)
          : null,

      /**
       * category normalization
       * string / array 혼재 대응
       */
      categories: Array.isArray(item.category)
        ? (item.category as string[])
        : item.category
          ? [item.category as string]
          : [],
    };
  });
}
