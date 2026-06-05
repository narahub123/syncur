"use server";

import { SITE_SEARCH_RESULT_LIMIT } from "@/features/rss/site/constants/site";
import { SiteRepository } from "@/features/rss/site/repository/siteRepository";
import { SiteSearchService } from "@/features/rss/site/service/stieService";
import { SiteSearchDto } from "@/features/rss/site/dto/search-site";

/**
 * Site 검색 Server Action
 *
 * @description
 * 사용자가 입력한 query를 기반으로 DB에 존재하는 Site를 검색한다.
 *
 * 전체 흐름:
 * 1. Repository에서 Site 목록 조회
 * 2. Service에서 검색 매칭 로직 수행
 * 3. 결과를 제한(limit) 후 DTO로 변환하여 반환
 *
 * @important
 * - RSS discovery는 포함하지 않는다 (DB 존재 여부 검색 단계)
 * - Client Component로 전달되기 때문에 반드시 DTO로 변환해야 한다
 * - Mongoose Document(ObjectId 등)는 그대로 전달하면 안 된다
 *
 * @layer
 * Action (orchestration layer)
 * - 비즈니스 로직 금지
 * - 단순 흐름 조립만 담당
 *
 * @returns
 * SiteSearchDto[] (Client-safe plain object)
 */
export async function searchSiteAction(query: string) {
  // 입력값 검증: 빈 값이면 즉시 종료
  if (!query?.trim()) return [];

  try {
    // 1. DB에서 Site 목록 조회 (Repository 책임)
    const sites = await SiteRepository.findAll();

    // 2. 검색 조건에 맞는 Site 필터링 (Service 책임)
    const filtered = sites.filter((site) =>
      SiteSearchService.match(site, query),
    );

    // 3. 결과 제한 + DTO 변환 (Action 책임)
    return filtered.slice(0, SITE_SEARCH_RESULT_LIMIT).map(
      (site): SiteSearchDto => ({
        _id: site._id.toString(), // Client safe 변환 (ObjectId → string)
        url: site.url,
        name: site.name,
        favicon_url: site.favicon_url ?? null,
        feed_url: site.feed_url ?? null,
      }),
    );
  } catch (error) {
    // 검색 실패 시 안전하게 fallback
    console.error("[searchSiteAction]", error);
    return [];
  }
}
