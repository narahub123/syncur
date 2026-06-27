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

// CSS 셀렉터 대신 DOM의 자식 태그 비율과 구조적 반복성을 직접 분석
export const EXCLUDE_CONTAINER_SELECTORS = [
  "[class*='tag']",
  "[class*='label']",
  "[class*='social']",
  "[class*='share']",
  "[class*='breadcrumb']",
  "[class*='tab']",
  "[class*='dropdown']",
];

