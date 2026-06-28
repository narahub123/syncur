import { SITE_FEED_STATUS } from "../constants/site";

/**
 * Site의 피드 수집 가능 상태 타입
 *
 * SITE_FEED_STATUS 상수 객체로부터 자동 파생된 유니온 타입
 * (RSS | CRAWLABLE | UNAVAILABLE)
 */
export type SiteFeedStatus =
  (typeof SITE_FEED_STATUS)[keyof typeof SITE_FEED_STATUS];
