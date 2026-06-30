import { IngestionStage } from "./types";

export const INGESTION_STAGE = {
  /**
   * ingestion 시작 지점
   */
  START: "START",

  /**
   * URL 정규화 단계
   * - 입력 URL을 표준 형태로 변환
   */
  URL_NORMALIZE: "URL_NORMALIZE",

  /**
   * 탐색 단계
   * - 사이트 구조 분석 및 후보 페이지 탐색
   */
  DISCOVER: "DISCOVER",

  RSS_DISCOVER: "RSS_DISCOVER",

  /**
   * HTML fetch 수행 단계
   * - 실제 HTTP 요청 발생
   */
  FETCH_SITE: "FETCH_SITE",

  FETCH_DYNAMIC_SITE: "FETCH_DYNAMIC_SITE",

  /**
   * HTML 수신 완료 상태
   * - fetch 결과 확보 시점
   */
  HTML_FETCHED: "HTML_FETCHED",

  SITEMAP_DETECT: "SITEMAP_DETECT",
  HTML_SITE_DETECT: "HTML_SITE_DETECT",

  /**
   * 리스트 페이지 여부 판단 단계
   * - 목록형 페이지인지 분석
   */
  LISTING_DETECT: "LISTING_DETECT",

  /**
   * 파서 선택 단계
   * - 적절한 parser 전략 결정
   */
  PARSER_SELECT: "PARSER_SELECT",

  /**
   * 파싱 수행 단계
   * - HTML → 구조화 데이터 변환
   */
  PARSE: "PARSE",

  /**
   * URL 추출 단계
   * - 콘텐츠 내부 링크 추출
   */
  NORMALIZE_URL: "NORMALIZE_URL",

  /**
   * 필터링 단계
   * - 불필요 URL / 데이터 제거
   */
  FILTER: "FILTER",

  /**
   * 최종 결과 정리 단계
   * - ingestion 결과 정리 및 output 구성
   */
  FINALIZE: "FINALIZE",

  /**
   * 정상 종료 지점
   */
  END: "END",

  /**
   * 오류 발생 단계
   * - ingestion pipeline 실패 상태
   */
  ERROR: "ERROR",

  /**
   * robots.txt 탐지
   */
  ROBOTS_CHECK: "ROBOTS_CHECK",
} as const;

export const INGESTION_STAGE_LABEL = {
  START: "시작",
  URL_NORMALIZE: "URL 정규화",
  DISCOVER: "탐색",
  FETCH_SITE: "페이지 요청",
  FETCH_DYNAMIC_SITE: "동적 페이지 요청",
  HTML_FETCHED: "HTML 수신",
  LISTING_DETECT: "목록 페이지 판별",
  PARSER_SELECT: "파서 선택",
  PARSE: "파싱",
  NORMALIZE_URL: "URL 추출",
  FILTER: "필터링",
  FINALIZE: "결과 정리",
  END: "종료",
  ERROR: "오류",
  RSS_DISCOVER: "RSS 탐색",
  SITEMAP_DETECT: "사이트맵 존재 판별",
  HTML_SITE_DETECT: "HTML SITE 판별",
  ROBOTS_CHECK: "robots.txt 탐지",
} satisfies Record<IngestionStage, string>;
