import {
  DetailPageConfig,
  FieldExtractor,
} from "@/features/ingestion/lib/discover/types";
import * as cheerio from "cheerio";

export interface DetailPageExtractResult {
  title: string | null;
  description: string | null;
  author: string | null;
  publishedAt: string | null;
  categories: string | null;
}

function extract(
  $: cheerio.CheerioAPI,
  extractor: FieldExtractor | null,
): string | null {
  if (!extractor) return null;
  const el = $(extractor.selector).first();
  if (!el.length) return null;
  return extractor.extract === "text"
    ? el.text().trim() || null
    : (el.attr(extractor.attr ?? "") ?? null);
}

/**
 * DetailPageConfig를 실제 상세 페이지에 적용해서 추출 결과를 반환합니다.
 *
 * @param url    - 상세 페이지 URL
 * @param config - extractDetailPageConfig로 생성한 config
 * @param headers - fetch 헤더
 */
export async function testDetailPageConfig(
  url: string,
  config: DetailPageConfig,
  headers: Record<string, string> = {},
): Promise<DetailPageExtractResult> {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(6000) });
  if (!res.ok) {
    throw new Error(`fetch 실패: ${res.status} ${url}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  return {
    title: extract($, config.title),
    description: extract($, config.description),
    author: extract($, config.author),
    publishedAt: extract($, config.publishedAt),
    categories: extract($, config.categories),
  };
}
