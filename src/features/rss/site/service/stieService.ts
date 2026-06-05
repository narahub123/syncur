/**
 * Site 검색 매칭 서비스
 *
 * @description
 * DB에서 가져온 Site 데이터와 사용자의 검색어를 기반으로
 * 검색 결과 포함 여부를 판단하는 순수 로직 계층이다.
 *
 * @important
 * - DB 접근 없음 (Repository 영역)
 * - URL 정규화 및 비교 로직만 담당
 * - RSS discovery나 구독 로직과 완전히 분리된 검색 단계
 *
 * @match strategy
 * - URL 기준: normalizeSiteIdentity 기반 비교
 * - name 기준: 단순 lowercase 포함 검색
 *
 * @note
 * Site 검색은 "정확한 일치"가 아니라
 * 사용자 입력 기반의 "유사 포함 검색" 전략을 사용한다.
 */
import { normalizeSiteIdentity } from "../utils/normalizeSiteIdentity";

export class SiteSearchService {
  /**
   * Site가 검색어에 매칭되는지 판단
   *
   * @param site DB에서 조회된 Site 데이터
   * @param query 사용자 입력 검색어
   *
   * @returns 검색어와 매칭되면 true
   */
  static match(site: { url: string; name: string }, query: string) {
    const q = normalizeSiteIdentity(query);
    const url = normalizeSiteIdentity(site.url);
    const name = site.name.toLowerCase();

    return url.includes(q) || name.includes(q);
  }
}
