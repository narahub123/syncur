import { Types } from "mongoose";
import { SiteFeedStatus } from ".";

/**
 * Site Lean Type
 *
 * mongoose .lean() 결과 전용 타입
 * - Document 메서드 없음
 * - timestamps 포함
 */
export type SiteLean = {
  _id: Types.ObjectId;

  /**
   * 사용자가 구독한 원본 페이지 URL
   */
  url: string;

  /**
   * 표시용 사이트 이름
   */
  name: string;

  /**
   * 파비콘 URL (nullable)
   */
  favicon_url: string | null;

  /**
   * 피드 수집 가능 상태
   *
   * - rss: RSS/Atom 기반 수집 가능
   * - crawlable: 크롤링 기반 수집 가능
   * - unavailable: 수집 불가
   */
  feedStatus: SiteFeedStatus;

  /**
   * timestamps
   */
  createdAt: Date;
  updatedAt: Date;
};
