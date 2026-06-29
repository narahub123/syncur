import { Types } from "mongoose";

/**
 * FeedSample Lean Type
 *
 * Mongoose Document에서 불필요한 메타 제거한
 * 서비스 레이어용 경량 타입
 */
export interface FeedSampleLean {
  _id: Types.ObjectId;

  feedId: Types.ObjectId;

  sourceType: "rss" | "crawler";

  link: string;
  title: string;

  description?: string;
  
  author?: string | null;

  publishedAt?: Date;

  categories: string[];

  status: "valid" | "invalid";

  error?: string;

  hash: string;

  createdAt: Date;
  updatedAt: Date;
}
