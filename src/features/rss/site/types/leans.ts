import { Types } from "mongoose";

/**
 * Site Lean Type
 *
 * mongoose .lean() 결과 전용 타입
 * - Document 메서드 없음
 * - timestamps snake_case 반영됨
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
   * RSS/Atom Feed URL (nullable)
   */
  feed_url: string | null;

  /**
   * timestamps (schema에서 snake_case로 설정됨)
   */
  createdAt: Date;
  updatedAt: Date;
};
