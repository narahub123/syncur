import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * FeedSample Document
 *
 * RSS / Crawler discovery 단계에서 수집된 샘플 아이템
 * 실제 FeedItem으로 들어가기 전 "검증용 데이터"
 */
export interface FeedSampleDocument extends Document {
  /**
   * 이 샘플이 속한 Feed
   */
  feedId: Types.ObjectId;

  /**
   * 데이터 소스 타입
   *
   * - rss: RSS/Atom 기반
   * - crawler: listing page 기반 추출
   */
  sourceType: "rss" | "crawler";

  /**
   * 콘텐츠 링크
   */
  link: string;

  /**
   * 제목
   */
  title: string;

  /**
   * 요약 / 설명 (optional)
   */
  description?: string;

  /**
   * 작성자 (optional)
   */
  author?: string;

  /**
   * 발행 시간 (optional)
   */
  publishedAt?: Date;

  /**
   * 카테고리 / 태그
   */
  categories: string[];

  /**
   * validation 상태
   *
   * - valid: 정상 샘플
   * - invalid: 파싱 실패 / 구조 이상
   */
  status: "valid" | "invalid";

  /**
   * validation 실패 이유 (optional)
   */
  error?: string;

  /**
   * dedup key
   *
   * RSS: guid or link
   * crawler: link + title hash
   */
  hash: string;

  createdAt: Date;
  updatedAt: Date;
}

const FeedSampleSchema = new Schema<FeedSampleDocument>(
  {
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
      index: true,
    },

    sourceType: {
      type: String,
      enum: ["rss", "crawler"],
      required: true,
      index: true,
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    author: {
      type: String,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    categories: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["valid", "invalid"],
      default: "valid",
      index: true,
    },

    error: {
      type: String,
      default: null,
    },

    hash: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Dedup 전략
 *
 * feed 단위 + hash 기준 중복 방지
 */
FeedSampleSchema.index({ feedId: 1, hash: 1 }, { unique: true });

/**
 * 최신 sample 조회용
 */
FeedSampleSchema.index({ feedId: 1, createdAt: -1 });

/**
 * 상태 기반 필터링
 */
FeedSampleSchema.index({ feedId: 1, status: 1 });

export const FeedSampleModel =
  mongoose.models.FeedSample ||
  mongoose.model<FeedSampleDocument>("FeedSample", FeedSampleSchema);
