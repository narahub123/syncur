import { Site } from "@/shared/types/site";
import { SiteContextDTO } from "../dto/siteDto";

/**
 * Context 생성 입력 데이터
 * - site: DB에 저장된 사이트 정보
 * - subscription: 해당 user의 구독 정보 (없으면 null)
 *
 * 👉 이 단계는 "조회 결과를 판단 가능한 형태로 변환"하기 위한 중간 데이터
 */
export type SiteContextInput = {
  site: Site;
  subscriptionExists: boolean;
};

/**
 * Site + Subscription을 하나의 "UI 판단용 Context"로 변환하는 pure function
 *
 * 👉 역할:
 * - DB 모델(site, subscription)을
 *   프론트가 바로 사용할 수 있는 상태 정보로 변환
 *
 * 👉 특징:
 * - DB 접근 없음
 * - side effect 없음
 * - 오직 계산만 수행
 */
export function buildSiteContext(input: SiteContextInput): SiteContextDTO {
  const { site, subscriptionExists } = input;

  /**
   * RSS 사용 가능 여부
   * - feed_url 존재 여부로 판단
   * - site의 capability (사이트 자체 능력)
   */
  const rssAvailable = site.feed_url != null;

  /**
   * 현재 사용자의 구독 여부
   * - subscription 존재 여부로 판단
   * - user-site 관계 상태
   */
  const isSubscribed = subscriptionExists;

  /**
   * 구독 가능 여부
   * - RSS 제공 사이트인지
   * - 아직 구독하지 않았는지
   *
   * 👉 UI 버튼 활성/비활성 결정에 사용
   */
  const canSubscribe = rssAvailable && !isSubscribed;

  /**
   * 프론트로 전달되는 최종 DTO
   * - domain object가 아니라 "UI 상태 데이터"
   */
  return {
    siteId: site._id.toString(),
    url: site.url,
    name: site.name,
    favicon_url: site.favicon_url,

    rssAvailable,
    isSubscribed,
    canSubscribe,
  };
}
