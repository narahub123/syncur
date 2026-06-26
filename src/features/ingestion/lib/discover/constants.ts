/**
 * 목록 페이지 감지에 사용되는 상수, 정규식, 선택자들을 정의합니다.
 */

/** URL 경로에 포함될 시 목록 페이지 가능성이 높은 키워드 목록 */
export const LISTING_PATH_KEYWORDS = [
  "board",
  "boards",
  "news",
  "notice",
  "notices",
  "post",
  "posts",
  "list",
  "listing",
  "article",
  "articles",
  "blog",
  "blogs",
  "feed",
  "community",
  "forum",
  "forums",
  "announce",
  "announcement",
  "press",
  "story",
  "stories",
  "update",
  "updates",
  "archive",
  "category",
  "categories",
  "tag",
  "tags",
  "topic",
  "topics",
  "공지",
  "게시판",
  "뉴스",
  "공고",
  "자료",
];

/** 상세 페이지로 추정되는 URL 패턴 (목록 페이지에서 제외할 조건) */
export const DETAIL_PAGE_PATTERNS = [
  /\/\d{4}\/\d{2}\/\d{2}\//,
  /[?&](id|idx|seq|no)=\d+/,
  /\/(view|detail|read)\//,
];

/** 분석 대상에서 제외할 노이즈 링크의 CSS 선택자 */
export const NOISE_SELECTORS = [
  "footer a",
  ".sitemap a",
  "#sitemap a",
  ".breadcrumb a",
  ".pagination a",
  ".gnb a",
  ".lnb a",
  ".snb a",
];

/** 게시물 날짜를 식별하기 위한 정규표현식 */
export const DATE_PATTERN = /\d{4}[-./]\d{1,2}[-./]\d{1,2}/g;

/** 게시물 작성자를 식별하기 위한 CSS 선택자 */
export const AUTHOR_SELECTORS = [
  "[class*='author']",
  "[class*='writer']",
  "[class*='nick']",
  ".by",
];
