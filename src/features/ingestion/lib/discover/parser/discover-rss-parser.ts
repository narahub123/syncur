import Parser from "rss-parser";
import { FEED_HEADERS } from "../../../constants/feed";
import * as crypto from "crypto";
import { convert } from "html-to-text";
import { Logger } from "../../../logger/types";

// rss-parser에서 제공하는 Item 인터페이스 사용
interface CustomItem extends Parser.Item {
  creator?: string;
  author?: string;
}

/**
 * RSS 아이템 데이터에서 중복 제거용 해시를 생성합니다.
 */
function generateHash(item: CustomItem): string {
  // item에 guid가 없을 경우를 대비해 link 혹은 title을 조합
  const input = item.guid || item.link || item.title || "";
  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * HTML 문자열을 입력받아 순수 텍스트로 변환합니다.
 */
function sanitizeHtml(html?: string): string {
  if (!html) return "";
  return convert(html, {
    wordwrap: false, // 줄바꿈 처리를 텍스트 기준으로 단순화
    selectors: [{ selector: "a", options: { ignoreHref: true } }], // 링크 URL 무시하고 텍스트만
  });
}

const parser = new Parser({
  headers: { ...FEED_HEADERS },
});

/**
 * RSS/Atom/JSON Feed URL로부터 피드 데이터를 파싱합니다.
 * @param {string} feedUrl - 발견된 피드의 절대 경로 URL
 * @returns {Promise<any>} 파싱된 피드 객체 (제목, 아이템 목록 등)
 */
export async function discoverParseRss(feedUrl: string, logger: Logger) {
  const feed = await parser.parseURL(feedUrl);

  logger.debug("RSS 응답 수신", {
    itemCount: feed.items?.length ?? 0,
  });

  logger.debug("RSS 아이템 변환 시작");
  // DB의 FeedItem 저장 구조에 맞게 아이템 리스트만 반환합니다.
  return feed.items.map((item: CustomItem) => {
    // 1. contentSnippet 우선, 없으면 content 사용
    const rawDescription = item.contentSnippet || item.content || "";

    // 2. html-to-text를 사용해 태그 제거
    const cleanDescription = sanitizeHtml(rawDescription);

    // 날짜가 없으면 현재 시간(new Date())을 할당
    const publishedAt = item.isoDate
      ? new Date(item.isoDate)
      : item.pubDate
        ? new Date(item.pubDate)
        : new Date();

    logger.debug("RSS 아이템 변환", {
      guid: item.guid,
      link: item.link,
    });

    return {
      guid: item.guid || null,
      link: item.link || "",
      title: item.title || "제목 없음",
      description: cleanDescription,
      author: (item.creator as string) || (item.author as string) || null,
      publishedAt: publishedAt,
      categories: item.categories || [],
      hash: generateHash(item),
    };
  });
}
