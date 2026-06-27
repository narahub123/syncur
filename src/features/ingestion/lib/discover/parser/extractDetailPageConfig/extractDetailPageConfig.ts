import * as cheerio from "cheerio";
import { DetailPageConfig } from "../../types";
import { NOISE_REMOVE_SELECTORS } from "./helpers/constants";
import { runTitlePipeline } from "./helpers/runTitlePipeline";
import { runDescriptionPipeline } from "./helpers/runDescriptionPipeline";
import { runPublishedAtPipeline } from "./helpers/runPublishedAtPipeline";
import { runAuthorPipeline } from "./helpers/runAuthorPipeline";
import { runCategoryPipeline } from "./helpers/runCategoryPipeline";

/**
 * 상세 페이지 DOM을 분석해 DetailPageConfig를 추출합니다.
 *
 * @param url - 상세 페이지 URL (대표 샘플)
 * @param dom - fetch한 Cheerio DOM
 */
export function extractDetailPageConfig(
  url: string,
  dom: cheerio.CheerioAPI,
): DetailPageConfig | null {
  const $ = dom;

  // 노이즈 영역 제거
  NOISE_REMOVE_SELECTORS.forEach((sel) => $(sel).remove());

  const title = runTitlePipeline($);
  const description = runDescriptionPipeline($);
  const author = runAuthorPipeline($);
  const publishedAt = runPublishedAtPipeline($);
  const categories = runCategoryPipeline($);

  // title은 필수 — 없으면 null 반환
  if (!title) return null;

  return {
    title,
    description,
    author,
    publishedAt,
    categories,
  };
}
