/**
 * Site 검색을 위해 DB에서 조회할 최대 개수
 *
 * @description
 * Repository 단계에서 사용하는 limit 값으로,
 * DB에서 한 번에 가져올 Site 데이터의 최대 크기를 제한한다.
 *
 * @purpose
 * - DB 과다 조회 방지
 * - 검색 대상 후보군 축소 (memory filter 비용 감소)
 * - 성능 안정성 확보
 *
 * @note
 * 실제 UI에 반환되는 결과 수와는 별개의 값이다.
 */
export const SITE_SEARCH_LIMIT = 50;

/**
 * Site 검색 결과로 클라이언트에 반환할 최대 개수
 *
 * @description
 * Action 단계에서 최종적으로 사용자에게 보여줄
 * 검색 결과 개수를 제한하는 값이다.
 *
 * @purpose
 * - UI 콤보박스 가독성 유지
 * - 과도한 검색 결과 방지
 * - UX 일관성 확보
 *
 * @note
 * SITE_SEARCH_LIMIT은 DB 조회 범위이고,
 * SITE_SEARCH_RESULT_LIMIT은 UI 반환 범위이다.
 */
export const SITE_SEARCH_RESULT_LIMIT = 10;
