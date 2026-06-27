/** 날짜 관련 attribute — datetime이 있으면 text보다 우선 */
export const DATE_ATTRS = [
  "datetime",
  "data-date",
  "data-time",
  "data-published",
];

/** 날짜 텍스트 패턴 */
export const DATE_PATTERN = /\d{4}[-./]\d{1,2}[-./]\d{1,2}/;

/** 제외할 노이즈 영역 */
export const NOISE_REMOVE_SELECTORS = [
  "nav",
  "header",
  "footer",
  "[class*='nav']",
  "[class*='menu']",
  "[class*='banner']",
  "[class*='ad']",
  "[class*='cookie']",
  "[class*='popup']",
];

/** 제외할 컨테이너 */
export const EXCLUDE_CONTAINER_SELECTORS = [
  "[class*='tag']",
  "[class*='label']",
  "[class*='social']",
  "[class*='share']",
  "[class*='breadcrumb']",
  "[class*='tab']",
  "[class*='dropdown']",
];

export const nextSelectors = [
  "[rel='next']",
  ".next a",
  ".next",
  "[class*='next']",
  "a[href*='page=']",
  "a[href*='p=']",
];
