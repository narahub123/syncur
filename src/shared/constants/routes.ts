/**
 * 애플리케이션에서 사용하는 주요 페이지 경로 상수.
 *
 * 목적:
 * - 하드코딩된 URL 문자열 사용을 방지한다.
 * - 페이지 이동, Link href, redirect 경로를 일관되게 관리한다.
 * - 경로 변경 시 한 곳에서 수정할 수 있도록 한다.
 */
export const ROUTES = {
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",

  FEED: "/feed",
  RECOMMENDATION: "/recommendation",
  POPULAR: "/popular",
  LIKES: "/likes",
  BOOKMARKS: "/bookmarks",

  SETTINGS: "/settings",
  SETTINGS_PROFILE: "/settings/profile",
  SETTINGS_INTERESTS: "/settings/interests",
  SETTINGS_APPEARANCE: "/settings/appearance",
  SETTINGS_SUBSCRIPTIONS: "/settings/subscriptions",

  HIDDEN: "/hidden",
} as const;

/**
 * ROUTES 객체에 정의된 모든 경로 문자열의 유니온 타입.
 *
 * 예:
 * "/" |
 * "/signup" |
 * "/login" |
 * "/feed" |
 * ...
 */
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
