import { SiteFeedStatus } from "../types";

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
  feedStatus: SiteFeedStatus;
};

/**
 * FeedItem 내부에서 Site 정보를 표현하는 DTO
 *
 * @description
 * FeedItem과 함께 내려가는 Site 최소 정보 구조
 */
export type FeedItemSiteDto = {
  siteId: string;
  url: string;
  name: string;
  favicon_url: string | null;
  feedStatus: SiteFeedStatus;
};

/**
 * Site 생성 요청 DTO
 *
 * @description
 * 클라이언트 → 서버로 전달되는 Site 생성 입력 데이터
 */
export type CreateSiteDto = {
  url: string;
  name: string;
  favicon_url: string | null;
  feedStatus: SiteFeedStatus;
};

/**
 * Site + Subscription Context DTO
 *
 * @description
 * UI에서 사이트 구독 상태와 가능 여부를 함께 표현하기 위한 복합 DTO
 */
export type SiteContextDTO = {
  siteId: string;

  /**
   * 연결된 Feed ID (없을 수도 있음)
   */
  feedId: string | undefined;

  url: string;
  name: string;
  favicon_url: string | null;

  /**
   * RSS / crawl 가능 여부 (UI 판단 기준)
   */
  feedStatus: SiteFeedStatus;

  /**
   * 현재 사용자의 구독 여부
   */
  isSubscribed: boolean;

  /**
   * 구독 가능 여부
   */
  canSubscribe: boolean;
};

/**
 * Site Client DTO
 *
 * @description
 * Client Component에서 직접 사용하는 Site 데이터 구조
 * 모든 값은 직렬화된 string 기반
 */
export type SiteDto = {
  _id: string;

  url: string;
  name: string;

  favicon_url: string | null;

  feedStatus: SiteFeedStatus;

  createdAt: string;
  updatedAt: string;
};
