import * as cheerio from "cheerio";
import { analyzeAuthors } from "./helpers/analyzeAuthors";
import { analyzeDates } from "./helpers/analyzeDates";
import { analyzeHierarchy } from "./helpers/analyzeHierarchy";
import { analyzePagination } from "./helpers/analyzePagination";
import { detectRepeatedStructure } from "./helpers/detectRepeatedStructure";
import { extractPageTitle } from "./helpers/extractPageTitle";
import { fetchContent } from "./helpers/fetchContent";
import { removeNoiseElements } from "./helpers/removeNoiseElements";
import { Logger } from "pino";

/**
 * 실제 페이지 내용을 fetch하여 상세 분석 후 점수를 업데이트합니다.
 *
 * @param url 분석 대상 URL
 * @param headers 요청 시 사용할 헤더
 * @param logger ingestion logger
 * @returns 점수와 사유가 포함된 객체
 */
export async function scoreByContent(
  url: string,
  headers: Record<string, string>,
  logger: Logger,
): Promise<{
  score: number;
  reason: string[];
  title: string | null;
  lastUpdated: string | null;
  dom: cheerio.CheerioAPI | null;
}> {
  const reason: string[] = [];
  let score = 0;
  let title: string | null = null;
  let lastUpdated: string | null = null;

  // 페이지를 조회하여 DOM을 생성합니다.
  const result = await fetchContent(url, headers, logger);

  if (!result) {
    logger.debug(
      {
        url,
        score,
      },
      "score.content.fetch.miss",
    );

    return {
      score,
      reason,
      title,
      lastUpdated,
      dom: null,
    };
  }

  const $ = result.dom;

  // 페이지 제목을 추출합니다.
  title = extractPageTitle($);

  logger.debug(
    {
      url,
      title,
    },
    "score.content.title.extracted",
  );

  // 반복 구조 탐지를 위해 노이즈 영역을 제거합니다.
  removeNoiseElements($);

  // 반복 구조를 탐지합니다.
  const repeated = detectRepeatedStructure(url, $);

  logger.debug(
    {
      url,
      itemCount: repeated.itemCount,
      hasListItems: !!repeated.listItems,
    },
    "score.content.structure.detected",
  );

  if (!repeated.listItems) {
    return {
      score,
      reason,
      title,
      lastUpdated,
      dom: $,
    };
  }

  score += 15;
  reason.push(`반복 구조 발견 (${repeated.itemCount}개 항목)`);

  logger.debug(
    {
      url,
      itemCount: repeated.itemCount,
    },
    "score.content.structure.hit",
  );

  // Parent / Sibling 관계를 분석합니다.
  const hierarchy = analyzeHierarchy($, url, repeated.listItems);

  logger.debug(
    {
      url,
      isParent: hierarchy.isParent,
      isSibling: hierarchy.isSibling,
      parentRatio: hierarchy.parentRatio,
      siblingRatio: hierarchy.siblingRatio,
    },
    "score.content.hierarchy.analyzed",
  );

  if (hierarchy.isParent) {
    score += 20;
    reason.push(
      `Parent-Child 관계 승리 (${(hierarchy.parentRatio * 100).toFixed(0)}%)`,
    );

    logger.debug(
      {
        url,
        parentRatio: hierarchy.parentRatio,
      },
      "score.content.hierarchy.parent",
    );
  } else if (
    hierarchy.isSibling &&
    !url.includes("?page=") &&
    !url.includes("?p=")
  ) {
    score -= 30;

    reason.push(
      `Sibling 관계 승리 (${(hierarchy.siblingRatio * 100).toFixed(0)}%): 상세 페이지 내 부가 목록 의심`,
    );

    logger.debug(
      {
        url,
        siblingRatio: hierarchy.siblingRatio,
      },
      "score.content.hierarchy.sibling",
    );
  }

  // 날짜 정보를 분석합니다.
  const dateResult = analyzeDates($, repeated.listItems);

  logger.debug(
    {
      url,
      uniqueDateCount: dateResult.uniqueDateCount,
      hasVariousDates: dateResult.hasVariousDates,
    },
    "score.content.date.analyzed",
  );

  if (dateResult.hasVariousDates) {
    score += 20;
    lastUpdated = dateResult.lastUpdated;

    reason.push(`다양한 날짜 발견 (${dateResult.uniqueDateCount}종류)`);

    logger.debug(
      {
        url,
        uniqueDateCount: dateResult.uniqueDateCount,
      },
      "score.content.date.various",
    );
  } else if (dateResult.uniqueDateCount === 1) {
    score -= 5;
    reason.push("날짜 모두 동일");

    logger.debug(
      {
        url,
      },
      "score.content.date.uniform",
    );
  }

  // 작성자 정보를 분석합니다.
  const authorHitCount = analyzeAuthors($, repeated.listItems);

  logger.debug(
    {
      url,
      authorHitCount,
    },
    "score.content.author.analyzed",
  );

  if (authorHitCount >= 3) {
    score += 10;
    reason.push(`작성자 정보 반복 (${authorHitCount}개 항목)`);

    logger.debug(
      {
        url,
        authorHitCount,
      },
      "score.content.author.hit",
    );
  }

  // 페이지네이션 존재 여부를 분석합니다.
  const hasPagination = analyzePagination($);

  logger.debug(
    {
      url,
      hasPagination,
    },
    "score.content.pagination.analyzed",
  );

  if (hasPagination) {
    score += 15;
    reason.push("페이지네이션 존재");

    logger.debug(
      {
        url,
      },
      "score.content.pagination.hit",
    );
  }

  logger.info(
    {
      url,
      score,
    },
    "score.content.done",
  );

  return {
    score,
    reason,
    title,
    lastUpdated,
    dom: $,
  };
}
