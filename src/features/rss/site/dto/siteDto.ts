/**
 * Site 검색 결과 DTO
 *
 * @description
 * Server Action에서 Client Component로 전달하기 위한
 * 안전한 직렬화(Serializable) 데이터 구조이다.
 *
 * @important
 * - Mongoose Document를 그대로 전달하지 않기 위해 생성된 DTO
 * - ObjectId, Date 등 비직렬화 타입은 모두 string/null로 변환한다
 * - Client UI에서 바로 사용할 수 있는 최소 필드만 포함한다
 *
 * @layer
 * - Action → Client boundary 전용 데이터 구조
 *
 * @usage
 * - combobox 검색 결과 표시
 * - 사이트 선택 UI
 * - 구독 전 확인 단계 데이터
 */
export type SiteSearchDto = {
  _id: string;
  url: string;
  name: string;
  favicon_url: string | null;
  feed_url: string | null;
};

export type FeedItemSiteDto = {
  siteId: string;
  url: string;
  name: string;
  favicon_url: string | null;
  feed_url: string | null;
};

export type CreateSiteDto = {
  url: string;
  name: string;
  favicon_url: string | null;
  feed_url: string | null;
};

export type SiteContextDTO = {
  siteId: string;
  feedId: string | undefined;
  url: string;
  name: string;
  favicon_url: string | null;

  rssAvailable: boolean;
  isSubscribed: boolean;
  canSubscribe: boolean;
};

/**
 * Site Client DTO
 *
 * - Client Component로 전달 가능한 순수 객체
 * - ObjectId / Date 모두 string으로 변환
 */
export type SiteDto = {
  _id: string;

  url: string;
  name: string;

  favicon_url: string | null;
  feed_url: string | null;

  createdAt: string;
  updatedAt: string;
};
